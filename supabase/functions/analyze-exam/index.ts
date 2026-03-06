import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth verification
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { pathScores, answers, questions, questionTimestamps, durationSeconds, locale } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
        model: "google/gemini-2.5-flash",
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
    return new Response(JSON.stringify({ error: "An internal error occurred. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
