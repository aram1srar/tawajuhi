import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { pathScores, answers, questions, questionTimestamps, durationSeconds, locale } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build a summary for the AI
    const pathSummary = Object.entries(pathScores as Record<string, { correct: number; total: number }>)
      .map(([path, { correct, total }]) => `${path}: ${correct}/${total} (${Math.round((correct / total) * 100)}%)`)
      .join(", ");

    const avgTimePerQuestion = questionTimestamps
      ? Object.values(questionTimestamps as Record<string, number>).reduce((a: number, b: number) => a + b, 0) / Object.keys(questionTimestamps).length
      : 0;

    const isArabic = locale === "ar";

    const systemPrompt = isArabic
      ? `أنت مستشار مهني ذكي لطلاب الثانوية في السعودية. حلل نتائج الاختبار وقدم توصية شخصية قصيرة (3-4 جمل فقط). اذكر المسار الأنسب ونقاط القوة. كن مشجعاً وواقعياً. لا تذكر الدرجات الرقمية.`
      : `You are a smart career advisor for Saudi high school students. Analyze the exam results and give a short personalized recommendation (3-4 sentences only). Mention the best-suited path and strengths. Be encouraging and realistic. Don't mention numeric scores.`;

    const userPrompt = isArabic
      ? `نتائج الطالب في الاختبار العام:\n${pathSummary}\nمتوسط وقت الإجابة: ${Math.round(avgTimePerQuestion)} ثانية لكل سؤال\nإجمالي الوقت: ${Math.round(durationSeconds / 60)} دقيقة\n\nالمسارات: cs=علوم الحاسب، health=الصحة والحياة، business=إدارة الأعمال، shariah=الشريعة\n\nقدم تحليلاً شخصياً قصيراً.`
      : `Student results on the general exam:\n${pathSummary}\nAverage response time: ${Math.round(avgTimePerQuestion)}s per question\nTotal time: ${Math.round(durationSeconds / 60)} minutes\n\nPaths: cs=Computer Science, health=Health & Life, business=Business, shariah=Shari'ah\n\nGive a short personalized analysis.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-exam error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
