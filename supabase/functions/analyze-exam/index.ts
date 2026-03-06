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

    const baseContext = isArabic
      ? `نتائج الطالب:\n${pathSummary}\nمتوسط وقت الإجابة: ${Math.round(avgTimePerQuestion)} ثانية\nإجمالي الوقت: ${Math.round(durationSeconds / 60)} دقيقة${openEndedContext ? `\n\nالإجابات المفتوحة:\n${openEndedContext}` : ""}${aiAnalysisContext ? `\n\nتحليل الكتابة:\n${aiAnalysisContext}` : ""}\n\nالمسارات: cs=علوم الحاسب، health=الصحة، business=إدارة الأعمال، shariah=الشريعة`
      : `Student results:\n${pathSummary}\nAvg response time: ${Math.round(avgTimePerQuestion)}s\nTotal time: ${Math.round(durationSeconds / 60)} min${openEndedContext ? `\n\nOpen-ended answers:\n${openEndedContext}` : ""}${aiAnalysisContext ? `\n\nWriting analysis:\n${aiAnalysisContext}` : ""}\n\nPaths: cs=Computer Science, health=Health, business=Business, shariah=Shari'ah`;

    // === PARALLEL AI CALLS with specialized models ===

    // 1. Career Recommendations (google/gemini-2.5-pro)
    const careerRecommendationPromise = fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: isArabic
            ? `أنت مستشار مهني متخصص لطلاب الثانوية في السعودية. بناءً على نتائج الاختبار والإجابات المفتوحة، قدم توصية مهنية دقيقة مع تصنيف المسارات حسب التوافق. ركز على تحليل البيانات الكمية والنوعية لتقديم أفضل توصية. ملاحظة مهمة: لا تذكر مهارات التواصل الشفهي أو اللفظي لأن الاختبار لا يتضمن أي تقييم شفهي - اذكر فقط مهارات الكتابة والتواصل الكتابي إن وُجدت.`
            : `You are a specialized career advisor for Saudi high school students. Based on exam results and open-ended answers, provide precise career recommendations with path compatibility rankings. Focus on analyzing both quantitative and qualitative data for the best recommendation. IMPORTANT: Do NOT mention verbal, oral, or spoken communication skills — this exam has no verbal component. Only reference written communication skills if relevant.`
          },
          { role: "user", content: baseContext + (isArabic ? "\n\nقدم توصية مهنية دقيقة وتصنيف المسارات." : "\n\nProvide precise career recommendation and path rankings.") },
        ],
        tools: [{
          type: "function",
          function: {
            name: "provide_career_recommendation",
            description: "Provide career path recommendation with compatibility scores",
            parameters: {
              type: "object",
              properties: {
                recommendation: { type: "string", description: "3-4 sentence personalized career recommendation" },
                careerFit: {
                  type: "array",
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
              required: ["recommendation", "careerFit"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "provide_career_recommendation" } },
      }),
    });

    // 2. Performance Feedback (openai/gpt-5)
    const performanceFeedbackPromise = fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-5",
        messages: [
          { role: "system", content: isArabic
            ? `أنت محلل أداء تعليمي متخصص. حلل أداء الطالب بدقة وحدد نقاط القوة والضعف وأسلوب التفكير. قدم نصائح عملية للتحسين بناءً على أخطائه وأنماط إجاباته. ملاحظة مهمة: لا تذكر مهارات التواصل الشفهي أو اللفظي لأن الاختبار لا يتضمن أي تقييم شفهي - اذكر فقط مهارات الكتابة والتواصل الكتابي إن وُجدت.`
            : `You are a specialized educational performance analyst. Analyze student performance precisely, identify strengths, weaknesses, and thinking style. Provide actionable improvement advice based on their errors and answer patterns. IMPORTANT: Do NOT mention verbal, oral, or spoken communication skills — this exam has no verbal component. Only reference written communication skills if relevant.`
          },
          { role: "user", content: baseContext + (isArabic ? "\n\nحلل الأداء وحدد نقاط القوة والضعف وأسلوب التفكير." : "\n\nAnalyze performance, identify strengths, weaknesses, and thinking style.") },
        ],
        tools: [{
          type: "function",
          function: {
            name: "provide_performance_feedback",
            description: "Provide detailed performance analysis with strengths, improvements, and thinking style",
            parameters: {
              type: "object",
              properties: {
                strengths: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      area: { type: "string" },
                      description: { type: "string" },
                    },
                    required: ["area", "description"],
                    additionalProperties: false,
                  },
                },
                improvements: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      area: { type: "string" },
                      advice: { type: "string" },
                    },
                    required: ["area", "advice"],
                    additionalProperties: false,
                  },
                },
                thinkingStyle: { type: "string", description: "1-2 sentences describing thinking/problem-solving style" },
                simulationInsight: { type: "string", description: "1-2 sentences about practical/simulation question handling" },
              },
              required: ["strengths", "improvements", "thinkingStyle", "simulationInsight"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "provide_performance_feedback" } },
      }),
    });

    // 3. Career Classification (google/gemini-3-pro-preview)
    const classificationPromise = fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-pro-preview",
        messages: [
          { role: "system", content: isArabic
            ? `أنت نظام تصنيف مهني ذكي. بناءً على جميع البيانات المتاحة (إجابات نظرية، عملية، مفتوحة، أوقات الإجابة)، صنّف الطالب في المسار الأنسب مع تحليل معمق لأسباب التصنيف. ملاحظة مهمة: لا تذكر مهارات التواصل الشفهي أو اللفظي لأن الاختبار لا يتضمن أي تقييم شفهي - اذكر فقط مهارات الكتابة والتواصل الكتابي إن وُجدت.`
            : `You are a smart career classification system. Based on all available data (theory, practical, open-ended answers, response times), classify the student into the best-fit path with deep analysis of classification reasons. IMPORTANT: Do NOT mention verbal, oral, or spoken communication skills — this exam has no verbal component. Only reference written communication skills if relevant.`
          },
          { role: "user", content: baseContext + (isArabic ? "\n\nصنّف الطالب وقدم تحليلاً معمقاً." : "\n\nClassify the student and provide deep analysis.") },
        ],
        tools: [{
          type: "function",
          function: {
            name: "classify_career",
            description: "Classify student into career path with reasoning",
            parameters: {
              type: "object",
              properties: {
                primaryPath: { type: "string", enum: ["cs", "health", "business", "shariah"] },
                confidence: { type: "number", description: "Classification confidence 0-100" },
                classificationReasoning: { type: "string", description: "2-3 sentences explaining the classification" },
                cognitiveProfile: { type: "string", description: "1-2 sentences about cognitive strengths observed" },
              },
              required: ["primaryPath", "confidence", "classificationReasoning", "cognitiveProfile"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "classify_career" } },
      }),
    });

    // Execute all 3 AI calls in parallel
    const [careerRes, feedbackRes, classificationRes] = await Promise.all([
      careerRecommendationPromise,
      performanceFeedbackPromise,
      classificationPromise,
    ]);

    // Handle rate limiting / payment errors
    for (const [name, res] of [["career", careerRes], ["feedback", feedbackRes], ["classification", classificationRes]] as [string, Response][]) {
      if (!res.ok) {
        if (res.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limited" }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (res.status === 402) {
          return new Response(JSON.stringify({ error: "Payment required" }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.error(`${name} AI error:`, res.status, await res.text());
      }
    }

    // Parse all responses
    const parseToolCall = async (res: Response) => {
      if (!res.ok) return null;
      try {
        const data = await res.json();
        const tc = data.choices?.[0]?.message?.tool_calls?.[0];
        if (tc?.function?.arguments) return JSON.parse(tc.function.arguments);
        return null;
      } catch { return null; }
    };

    const [careerData, feedbackData, classificationData] = await Promise.all([
      parseToolCall(careerRes),
      parseToolCall(feedbackRes),
      parseToolCall(classificationRes),
    ]);

    // Merge all results into unified analysis
    const analysis: any = {
      recommendation: careerData?.recommendation || "",
      careerFit: careerData?.careerFit || [],
      strengths: feedbackData?.strengths || [],
      improvements: feedbackData?.improvements || [],
      thinkingStyle: feedbackData?.thinkingStyle || "",
      simulationInsight: feedbackData?.simulationInsight || "",
      classification: classificationData || null,
    };

    return new Response(JSON.stringify({ analysis, structured: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("analyze-exam error:", e);
    return new Response(JSON.stringify({ error: "An internal error occurred. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
