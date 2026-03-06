import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
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

    const { results, locale } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const isArabic = locale === "ar";

    const resultsSummary = (results as any[]).map((r: any) => {
      return `Path: ${r.career_path}, Score: ${r.total_score}%, Theory: ${r.theory_score}%, Interest: ${r.simulation_score}%, Duration: ${Math.round((r.duration_seconds || 0) / 60)}min, Date: ${r.created_at}`;
    }).join("\n");

    const systemPrompt = isArabic
      ? `أنت مستشار مهني ذكي لطلاب الثانوية في السعودية. حلل نتائج الاختبارات وقدم تحليلاً مفصلاً باستخدام أداة التحليل المنظمة. قيّم المهارات من 0 إلى 100. اكتب ملخصاً مختصراً وتعليقاً تحفيزياً. اكتب بالعربية. ملاحظة مهمة: لا تذكر مهارات التواصل الشفهي أو اللفظي لأن الاختبار لا يتضمن أي تقييم شفهي - اذكر فقط مهارات الكتابة والتواصل الكتابي إن وُجدت.`
      : `You are a smart career advisor for Saudi high school students. Analyze all exam results and provide structured analysis using the tool. Rate skills 0-100. Write a short summary and encouraging feedback. Write in English. IMPORTANT: Do NOT mention verbal, oral, or spoken communication skills — this exam has no verbal component. Only reference written communication skills if relevant.`;

    const userPrompt = isArabic
      ? `نتائج الاختبارات:\n${resultsSummary}\n\nالمسارات: cs=علوم الحاسب، health=الصحة والحياة، business=إدارة الأعمال، shariah=الشريعة، general=العام\n\nقدم تحليلاً منظماً. لا تذكر أي مهارات شفهية أو لفظية.`
      : `Exam results:\n${resultsSummary}\n\nPaths: cs=Computer Science, health=Health & Life, business=Business, shariah=Shari'ah, general=General\n\nProvide structured analysis. Do not mention any verbal or oral skills.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_analysis",
              description: "Provide structured skill analysis with scores, summary, and feedback",
              parameters: {
                type: "object",
                properties: {
                  skills: {
                    type: "array",
                    description: "List of 5-7 skill areas with scores",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Skill name (in the requested language)" },
                        score: { type: "number", description: "Score 0-100" },
                        category: { type: "string", enum: ["strength", "average", "improve"], description: "strength if >=75, average if >=50, improve if <50" },
                      },
                      required: ["name", "score", "category"],
                      additionalProperties: false,
                    },
                  },
                  pathScores: {
                    type: "array",
                    description: "Career path compatibility scores",
                    items: {
                      type: "object",
                      properties: {
                        path: { type: "string", description: "Path key: health, cs, business, shariah" },
                        score: { type: "number", description: "Compatibility score 0-100" },
                      },
                      required: ["path", "score"],
                      additionalProperties: false,
                    },
                  },
                  summary: { type: "string", description: "2-3 sentence summary of overall performance" },
                  feedback: { type: "string", description: "2-3 sentence encouraging feedback with specific advice" },
                },
                required: ["skills", "pathScores", "summary", "feedback"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_analysis" } },
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
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const analysis = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ analysis }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: return text report
    const report = data.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ report }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-strengths error:", e);
    return new Response(JSON.stringify({ error: "An internal error occurred. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
