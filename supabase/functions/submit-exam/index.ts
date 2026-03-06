import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Server-side answer key
const ANSWER_KEY: Record<string, number> = {
  cs1: 1, cs2: 0, cs3: 1, cs4: 1, cs5: 1, cs6: 1, cs7: 2, cs8: 1,
  cs9: 0, cs10: 0, cs11: 0, cs12: 0, cs13: 0, cs14: 0,
  cs_sw1: 0, cs_sys1: 0, cs_net1: 0, cs_elec1: 0, cs_mech1: 0, cs_env1: 0,
  cs_cyber1: 0, cs_elecdesign1: 0, cs_resistance1: 0, cs_processor1: 1,
  h1: 1, h2: 1, h3: 2, h4: 1, h5: 1, h6: 2, h7: 1, h8: 0,
  h9: 0, h10: 0, h11: 0, h12: 0, h13: 0, h14: 0,
  h_nurse1: 0, h_gp1: 1, h_er1: 0, h_pt1: 1, h_icu1: 0, h_pharm1: 1,
  h_diabetes1: 0, h_sports1: 3, h_diagnosis1: 1, h_medicine1: 3,
  b1: 1, b2: 1, b3: 1, b4: 1, b5: 1, b6: 1, b7: 1, b8: 0,
  b9: 0, b10: 0, b11: 0, b12: 0, b13: 0, b14: 0,
  b_pm1: 1, b_ba1: 0, b_mkt1: 0, b_fin1: 1, b_ops1: 0,
  b_sales1: 0, b_team1: 0, b_accounting1: 1, b_strategic1: 1,
  sh1: 0, sh2: 1, sh3: 2, sh4: 1, sh5: 0, sh6: 1, sh7: 1, sh8: 1,
  sh9: 0, sh10: 0, sh11: 0, sh12: 0, sh13: 0, sh14: 0,
  sh_scholar1: 0, sh_legal1: 1, sh_defense1: 0, sh_judge1: 0, sh_consultant1: 0,
  sh_prayer1: 1, sh_labor1: 0, sh_fiqh1: 2, sh_usul1: 2,
  pref1: 0, pref2: 0, pref3: 0, pref4: 2,
};

const QUESTION_TYPE: Record<string, string> = {
  cs1: "theory", cs2: "theory", cs3: "theory", cs4: "theory", cs5: "theory", cs6: "theory", cs7: "theory", cs8: "theory",
  cs9: "interest", cs10: "interest", cs11: "interest", cs12: "interest", cs13: "interest", cs14: "interest",
  cs_sw1: "practical", cs_sys1: "practical", cs_net1: "practical", cs_elec1: "practical", cs_mech1: "practical", cs_env1: "practical",
  cs_cyber1: "practical", cs_elecdesign1: "practical", cs_resistance1: "theory", cs_processor1: "theory",
  h1: "theory", h2: "theory", h3: "theory", h4: "theory", h5: "theory", h6: "theory", h7: "theory", h8: "theory",
  h9: "interest", h10: "interest", h11: "interest", h12: "interest", h13: "interest", h14: "interest",
  h_nurse1: "practical", h_gp1: "practical", h_er1: "practical", h_pt1: "practical", h_icu1: "practical", h_pharm1: "practical",
  h_diabetes1: "practical", h_sports1: "practical", h_diagnosis1: "theory", h_medicine1: "theory",
  b1: "theory", b2: "theory", b3: "theory", b4: "theory", b5: "theory", b6: "theory", b7: "theory", b8: "theory",
  b9: "interest", b10: "interest", b11: "interest", b12: "interest", b13: "interest", b14: "interest",
  b_pm1: "practical", b_ba1: "practical", b_mkt1: "practical", b_fin1: "practical", b_ops1: "practical",
  b_sales1: "practical", b_team1: "practical", b_accounting1: "theory", b_strategic1: "theory",
  sh1: "theory", sh2: "theory", sh3: "theory", sh4: "theory", sh5: "theory", sh6: "theory", sh7: "theory", sh8: "theory",
  sh9: "interest", sh10: "interest", sh11: "interest", sh12: "interest", sh13: "interest", sh14: "interest",
  sh_scholar1: "practical", sh_legal1: "practical", sh_defense1: "practical", sh_judge1: "practical", sh_consultant1: "practical",
  sh_prayer1: "practical", sh_labor1: "practical", sh_fiqh1: "theory", sh_usul1: "theory",
  pref1: "interest", pref2: "interest", pref3: "interest", pref4: "interest",
};

const QUESTION_PATH: Record<string, string> = {
  cs1: "cs", cs2: "cs", cs3: "cs", cs4: "cs", cs5: "cs", cs6: "cs", cs7: "cs", cs8: "cs",
  cs9: "cs", cs10: "cs", cs11: "cs", cs12: "cs", cs13: "cs", cs14: "cs",
  cs_sw1: "cs", cs_sys1: "cs", cs_net1: "cs", cs_elec1: "cs", cs_mech1: "cs", cs_env1: "cs",
  cs_cyber1: "cs", cs_elecdesign1: "cs", cs_resistance1: "cs", cs_processor1: "cs",
  h1: "health", h2: "health", h3: "health", h4: "health", h5: "health", h6: "health", h7: "health", h8: "health",
  h9: "health", h10: "health", h11: "health", h12: "health", h13: "health", h14: "health",
  h_nurse1: "health", h_gp1: "health", h_er1: "health", h_pt1: "health", h_icu1: "health", h_pharm1: "health",
  h_diabetes1: "health", h_sports1: "health", h_diagnosis1: "health", h_medicine1: "health",
  b1: "business", b2: "business", b3: "business", b4: "business", b5: "business", b6: "business", b7: "business", b8: "business",
  b9: "business", b10: "business", b11: "business", b12: "business", b13: "business", b14: "business",
  b_pm1: "business", b_ba1: "business", b_mkt1: "business", b_fin1: "business", b_ops1: "business",
  b_sales1: "business", b_team1: "business", b_accounting1: "business", b_strategic1: "business",
  sh1: "shariah", sh2: "shariah", sh3: "shariah", sh4: "shariah", sh5: "shariah", sh6: "shariah", sh7: "shariah", sh8: "shariah",
  sh9: "shariah", sh10: "shariah", sh11: "shariah", sh12: "shariah", sh13: "shariah", sh14: "shariah",
  sh_scholar1: "shariah", sh_legal1: "shariah", sh_defense1: "shariah", sh_judge1: "shariah", sh_consultant1: "shariah",
  sh_prayer1: "shariah", sh_labor1: "shariah", sh_fiqh1: "shariah", sh_usul1: "shariah",
  pref1: "health", pref2: "shariah", pref3: "cs", pref4: "business",
};

async function analyzeOpenEndedAnswers(
  openAnswers: Record<string, string>,
  careerPath: string,
  locale: string,
  apiKey: string
): Promise<{ openEndedAnalysis: any } | null> {
  if (!openAnswers || Object.keys(openAnswers).length === 0) return null;

  const answersText = Object.entries(openAnswers)
    .map(([qId, answer]) => `Question ${qId}: "${answer}"`)
    .join("\n");

  const isArabic = locale === "ar";
  const systemPrompt = isArabic
    ? `أنت محلل مهني ذكي متخصص في تحليل إجابات طلاب الثانوية السعوديين. حلل الإجابات المفتوحة واستخرج المهارات والاهتمامات ونقاط القوة. استخدم أداة التحليل المنظمة.`
    : `You are a smart career analyst specializing in analyzing Saudi high school students' responses. Analyze open-ended answers to extract skills, interests, and strengths. Use the structured analysis tool.`;

  const userPrompt = isArabic
    ? `إجابات الطالب المفتوحة (المسار: ${careerPath}):\n${answersText}\n\nحلل هذه الإجابات واستخرج المهارات والاهتمامات المهنية والتوصيات.`
    : `Student's open-ended answers (path: ${careerPath}):\n${answersText}\n\nAnalyze these answers to extract skills, career interests, and recommendations.`;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5.2",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "analyze_open_answers",
            description: "Structured analysis of open-ended student answers",
            parameters: {
              type: "object",
              properties: {
                detectedSkills: {
                  type: "array",
                  description: "Skills detected from the student's writing",
                  items: {
                    type: "object",
                    properties: {
                      skill: { type: "string", description: "Skill name in the requested language" },
                      confidence: { type: "number", description: "Confidence 0-100" },
                      evidence: { type: "string", description: "Brief quote or reasoning from the answer" },
                    },
                    required: ["skill", "confidence", "evidence"],
                    additionalProperties: false,
                  },
                },
                careerAffinity: {
                  type: "array",
                  description: "Career paths the student shows affinity for based on their writing",
                  items: {
                    type: "object",
                    properties: {
                      path: { type: "string", enum: ["cs", "health", "business", "shariah"] },
                      score: { type: "number", description: "Affinity score 0-100" },
                      reasoning: { type: "string", description: "Why this path matches" },
                    },
                    required: ["path", "score", "reasoning"],
                    additionalProperties: false,
                  },
                },
                writingQuality: {
                  type: "object",
                  properties: {
                    clarity: { type: "number", description: "Writing clarity 0-100" },
                    depth: { type: "number", description: "Analytical depth 0-100" },
                    creativity: { type: "number", description: "Creative thinking 0-100" },
                    problemSolving: { type: "number", description: "Problem-solving approach 0-100" },
                  },
                  required: ["clarity", "depth", "creativity", "problemSolving"],
                  additionalProperties: false,
                },
                overallInsight: { type: "string", description: "2-3 sentence insight about the student's thinking pattern and career potential" },
              },
              required: ["detectedSkills", "careerAffinity", "writingQuality", "overallInsight"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "analyze_open_answers" } },
      }),
    });

    if (!response.ok) {
      console.error("Open-ended AI error:", response.status);
      return null;
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      return { openEndedAnalysis: JSON.parse(toolCall.function.arguments) };
    }
    return null;
  } catch (e) {
    console.error("Open-ended analysis error:", e);
    return null;
  }
}

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
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { answers, openAnswers: rawOpenAnswers, careerPath, examType, durationSeconds, questionTimestamps, locale } = await req.json();

    // Sanitize open-ended answers: truncate each to 500 chars, max 20 entries, aggregate max 5000 chars
    let openAnswers: Record<string, string> = {};
    if (rawOpenAnswers && typeof rawOpenAnswers === "object") {
      let totalLength = 0;
      const entries = Object.entries(rawOpenAnswers).slice(0, 20);
      for (const [key, val] of entries) {
        const sanitized = String(val).slice(0, 500);
        totalLength += sanitized.length;
        if (totalLength > 5000) break;
        openAnswers[key] = sanitized;
      }
    }

    if (!answers || typeof answers !== "object") {
      return new Response(JSON.stringify({ error: "Invalid answers" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!careerPath || typeof careerPath !== "string") {
      return new Response(JSON.stringify({ error: "Invalid career path" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    // Analyze open-ended answers with AI (non-blocking for scoring)
    let openEndedAnalysisResult: any = null;
    if (LOVABLE_API_KEY && openAnswers && Object.keys(openAnswers).length > 0) {
      openEndedAnalysisResult = await analyzeOpenEndedAnswers(
        openAnswers, careerPath, locale || "ar", LOVABLE_API_KEY
      );
    }

    if (examType === "general") {
      const pathScores: Record<string, { correct: number; total: number }> = {};

      for (const [qId, selectedIndex] of Object.entries(answers)) {
        if (typeof selectedIndex !== "number") continue;
        const correctIdx = ANSWER_KEY[qId];
        if (correctIdx === undefined) continue;
        const qPath = QUESTION_PATH[qId];
        if (!qPath) continue;

        if (!pathScores[qPath]) pathScores[qPath] = { correct: 0, total: 0 };
        pathScores[qPath].total++;
        if (selectedIndex === correctIdx) pathScores[qPath].correct++;
      }

      const totalCorrect = Object.values(pathScores).reduce((s, p) => s + p.correct, 0);
      const totalQuestions = Object.values(pathScores).reduce((s, p) => s + p.total, 0);
      const totalScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      let bestPath = "";
      let bestPct = 0;
      for (const [path, { correct, total }] of Object.entries(pathScores)) {
        const pct = total > 0 ? correct / total : 0;
        if (pct > bestPct) { bestPct = pct; bestPath = path; }
      }

      // If AI analysis found a strong career affinity, factor it in
      if (openEndedAnalysisResult?.openEndedAnalysis?.careerAffinity) {
        const aiTopPath = openEndedAnalysisResult.openEndedAnalysis.careerAffinity
          .sort((a: any, b: any) => b.score - a.score)[0];
        if (aiTopPath && aiTopPath.score >= 70 && !bestPath) {
          bestPath = aiTopPath.path;
        }
      }

      const safeDuration = Math.min(Math.max(0, Number(durationSeconds) || 0), 86400);

      // Store open-ended analysis as feedback
      const feedbackText = openEndedAnalysisResult?.openEndedAnalysis?.overallInsight || null;

      const { error: insertError } = await supabase.from("test_results").insert({
        user_id: user.id,
        career_path: "general",
        theory_score: totalScore,
        simulation_score: 0,
        total_score: totalScore,
        answers: {
          ...answers,
          openAnswers: openAnswers || {},
          openEndedAnalysis: openEndedAnalysisResult?.openEndedAnalysis || null,
        },
        recommended_paths: bestPath ? [bestPath] : [],
        duration_seconds: safeDuration,
        feedback: feedbackText,
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(JSON.stringify({ error: "Failed to save results" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        totalScore,
        pathScores,
        bestPath,
        durationSeconds: safeDuration,
        openEndedAnalysis: openEndedAnalysisResult?.openEndedAnalysis || null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else {
      // Pathway exam
      let theoryCorrect = 0, interestCorrect = 0, theoryTotal = 0, interestTotal = 0;

      for (const [qId, selectedIndex] of Object.entries(answers)) {
        if (typeof selectedIndex !== "number") continue;
        const correctIdx = ANSWER_KEY[qId];
        if (correctIdx === undefined) continue;
        const qType = QUESTION_TYPE[qId];

        if (qType === "theory" || qType === "practical") {
          theoryTotal++;
          if (selectedIndex === correctIdx) theoryCorrect++;
        } else if (qType === "interest") {
          interestTotal++;
          if (selectedIndex === correctIdx) interestCorrect++;
        }
      }

      const theoryScore = theoryTotal > 0 ? Math.round((theoryCorrect / theoryTotal) * 100) : 0;
      const simScore = interestTotal > 0 ? Math.round((interestCorrect / interestTotal) * 100) : 0;
      const totalScore = (theoryTotal + interestTotal) > 0
        ? Math.round(((theoryCorrect + interestCorrect) / (theoryTotal + interestTotal)) * 100)
        : 0;
      const safeDuration = Math.min(Math.max(0, Number(durationSeconds) || 0), 86400);

      const feedbackText = openEndedAnalysisResult?.openEndedAnalysis?.overallInsight || null;

      const { error: insertError } = await supabase.from("test_results").insert({
        user_id: user.id,
        career_path: careerPath,
        theory_score: theoryScore,
        simulation_score: simScore,
        total_score: totalScore,
        answers: {
          ...answers,
          openAnswers: openAnswers || {},
          openEndedAnalysis: openEndedAnalysisResult?.openEndedAnalysis || null,
        },
        recommended_paths: totalScore >= 60 ? [careerPath] : [],
        duration_seconds: safeDuration,
        feedback: feedbackText,
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(JSON.stringify({ error: "Failed to save results" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        theoryScore,
        simScore,
        totalScore,
        durationSeconds: safeDuration,
        openEndedAnalysis: openEndedAnalysisResult?.openEndedAnalysis || null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

  } catch (e) {
    console.error("submit-exam error:", e);
    return new Response(JSON.stringify({ error: "An internal error occurred. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
