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

    const { pathScores, answers, questions, questionTimestamps, durationSeconds, locale, openAnswers, openEndedAnalysis } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const pathSummary = Object.entries(pathScores as Record<string, { correct: number; total: number }>)
      .map(([path, { correct, total }]) => `${path}: ${correct}/${total} (${Math.round((correct / total) * 100)}%)`)
      .join(", ");

    const avgTimePerQuestion = questionTimestamps
      ? Object.values(questionTimestamps as Record<string, number>).reduce((a: number, b: number) => a + b, 0) / Object.keys(questionTimestamps).length
      : 0;

    const isArabic = locale === "ar";

    // Build open-ended context
    let openEndedContext = "";
    if (openAnswers && typeof openAnswers === "object" && Object.keys(openAnswers).length > 0) {
      const entries = Object.entries(openAnswers as Record<string, string>);
      openEndedContext = entries.map(([qId, ans]) => `[${qId}]: "${ans}"`).join("\n");
    }

    let aiAnalysisContext = "";
    if (openEndedAnalysis) {
      if (openEndedAnalysis.detectedSkills?.length) {
        aiAnalysisContext += "\nDetected skills from writing: " + 
          openEndedAnalysis.detectedSkills.map((s: any) => `${s.skill} (${s.confidence}%)`).join(", ");
      }
      if (openEndedAnalysis.writingQuality) {
        const wq = openEndedAnalysis.writingQuality;
        aiAnalysisContext += `\nWriting quality: clarity=${wq.clarity}%, depth=${wq.depth}%, creativity=${wq.creativity}%, problemSolving=${wq.problemSolving}%`;
      }
      if (openEndedAnalysis.careerAffinity?.length) {
        aiAnalysisContext += "\nCareer affinity from writing: " +
          openEndedAnalysis.careerAffinity.map((c: any) => `${c.path}: ${c.score}%`).join(", ");
      }
    }

    const systemPrompt = isArabic
      ? `أنت مستشار مهني ذكي لطلاب الثانوية في السعودية. حلل نتائج الاختبار بما فيها الإجابات المفتوحة وقدم تحليلاً شاملاً باستخدام أداة التحليل المنظمة. قيّم أداء الطالب في الأسئلة النظرية والعملية والمفتوحة. حلل طريقة تفكير الطالب ومدى شغفه بالمجال. قدم توصيات مفصلة.`
      : `You are a smart career advisor for Saudi high school students. Analyze the complete exam results including open-ended answers and provide comprehensive analysis using the structured tool. Evaluate performance across theory, practical simulations, and open-ended responses. Analyze the student's thinking pattern and passion for the field. Give detailed recommendations.`;

    const userPrompt = isArabic
      ? `نتائج الطالب:\n${pathSummary}\nمتوسط وقت الإجابة: ${Math.round(avgTimePerQuestion)} ثانية\nإجمالي الوقت: ${Math.round(durationSeconds / 60)} دقيقة${openEndedContext ? `\n\nالإجابات المفتوحة:\n${openEndedContext}` : ""}${aiAnalysisContext ? `\n\nتحليل الكتابة:\n${aiAnalysisContext}` : ""}\n\nالمسارات: cs=علوم الحاسب، health=الصحة، business=إدارة الأعمال، shariah=الشريعة\n\nقدم تحليلاً منظماً شاملاً.`
      : `Student results:\n${pathSummary}\nAvg response time: ${Math.round(avgTimePerQuestion)}s\nTotal time: ${Math.round(durationSeconds / 60)} min${openEndedContext ? `\n\nOpen-ended answers:\n${openEndedContext}` : ""}${aiAnalysisContext ? `\n\nWriting analysis:\n${aiAnalysisContext}` : ""}\n\nPaths: cs=Computer Science, health=Health, business=Business, shariah=Shari'ah\n\nProvide comprehensive structured analysis.`;

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
        tools: [{
          type: "function",
          function: {
            name: "provide_exam_analysis",
            description: "Provide comprehensive exam analysis with career recommendations, skill assessment, and feedback",
            parameters: {
              type: "object",
              properties: {
                recommendation: {
                  type: "string",
                  description: "3-4 sentence personalized career recommendation mentioning the best path and why",
                },
                strengths: {
                  type: "array",
                  description: "3-5 key strengths identified from all question types",
                  items: {
                    type: "object",
                    properties: {
                      area: { type: "string", description: "Strength area name" },
                      description: { type: "string", description: "Brief description of this strength" },
                    },
                    required: ["area", "description"],
                    additionalProperties: false,
                  },
                },
                improvements: {
                  type: "array",
                  description: "2-3 areas for improvement with actionable advice",
                  items: {
                    type: "object",
                    properties: {
                      area: { type: "string", description: "Area needing improvement" },
                      advice: { type: "string", description: "Specific actionable advice" },
                    },
                    required: ["area", "advice"],
                    additionalProperties: false,
                  },
                },
                thinkingStyle: {
                  type: "string",
                  description: "1-2 sentences describing the student's thinking/problem-solving style based on their answers",
                },
                simulationInsight: {
                  type: "string",
                  description: "1-2 sentences about how the student handled practical/simulation questions",
                },
                careerFit: {
                  type: "array",
                  description: "Career paths ranked by fit",
                  items: {
                    type: "object",
                    properties: {
                      path: { type: "string", enum: ["cs", "health", "business", "shariah"] },
                      fitScore: { type: "number", description: "Fit score 0-100" },
                      reason: { type: "string", description: "Why this path fits or doesn't" },
                    },
                    required: ["path", "fitScore", "reason"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["recommendation", "strengths", "improvements", "thinkingStyle", "simulationInsight", "careerFit"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "provide_exam_analysis" } },
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
      return new Response(JSON.stringify({ analysis, structured: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback to text
    const analysis = data.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ analysis, structured: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-exam error:", e);
    return new Response(JSON.stringify({ error: "An internal error occurred. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
