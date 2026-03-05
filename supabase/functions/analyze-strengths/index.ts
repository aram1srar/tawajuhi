import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { results, locale } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const isArabic = locale === "ar";

    // Build summary of all exam results
    const resultsSummary = (results as any[]).map((r: any) => {
      return `Path: ${r.career_path}, Score: ${r.total_score}%, Theory: ${r.theory_score}%, Interest: ${r.simulation_score}%, Duration: ${Math.round((r.duration_seconds || 0) / 60)}min, Date: ${r.created_at}`;
    }).join("\n");

    const systemPrompt = isArabic
      ? `أنت مستشار مهني ذكي لطلاب الثانوية في السعودية. قم بتحليل نتائج جميع الاختبارات التي أجراها الطالب وقدم تقريراً مفصلاً عن نقاط قوته ومهاراته. اذكر المجالات التي يتفوق فيها والمجالات التي يمكنه تحسينها. كن مشجعاً ومحدداً. اكتب 4-6 جمل. لا تذكر الدرجات الرقمية مباشرة.`
      : `You are a smart career advisor for Saudi high school students. Analyze all the student's exam results and provide a detailed report on their strengths and skills. Mention areas they excel in and areas for improvement. Be encouraging and specific. Write 4-6 sentences. Don't mention numeric scores directly.`;

    const userPrompt = isArabic
      ? `نتائج جميع الاختبارات:\n${resultsSummary}\n\nالمسارات: cs=علوم الحاسب، health=الصحة والحياة، business=إدارة الأعمال، shariah=الشريعة، general=الاختبار العام\n\nقدم تقريراً مفصلاً عن نقاط القوة والمهارات.`
      : `All exam results:\n${resultsSummary}\n\nPaths: cs=Computer Science, health=Health & Life, business=Business, shariah=Shari'ah, general=General Exam\n\nProvide a detailed strengths and skills report.`;

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
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const report = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ report }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-strengths error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
