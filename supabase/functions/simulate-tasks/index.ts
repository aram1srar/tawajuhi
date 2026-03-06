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
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { careerPath, locale, studentContext } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!careerPath || typeof careerPath !== "string") {
      return new Response(JSON.stringify({ error: "Invalid career path" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isArabic = locale === "ar";

    const pathDescriptions: Record<string, { ar: string; en: string }> = {
      cs: { ar: "علوم الحاسب والهندسة - مهندس برمجيات، مهندس شبكات، مهندس أمن سيبراني", en: "Computer Science & Engineering - Software engineer, Network engineer, Cybersecurity engineer" },
      health: { ar: "العلوم الصحية - طبيب، ممرض، صيدلي، أخصائي علاج طبيعي", en: "Health Sciences - Doctor, Nurse, Pharmacist, Physical therapist" },
      business: { ar: "إدارة الأعمال - مدير مشاريع، محلل أعمال، مسوق، محاسب", en: "Business Administration - Project manager, Business analyst, Marketer, Accountant" },
      shariah: { ar: "الشريعة والدراسات الإسلامية - قاضي، مستشار شرعي، باحث، محامي", en: "Shari'ah & Islamic Studies - Judge, Shari'ah consultant, Researcher, Lawyer" },
    };

    const systemPrompt = isArabic
      ? `أنت مُحاكي مهني ذكي يصمم مهام يومية واقعية يواجهها المحترفون في مسارهم المهني. صمم سيناريو محاكاة تفاعلي مع 3 مهام يومية واقعية، كل مهمة تحتوي على موقف وخيارات متعددة. قيّم مستوى الاهتمام والكفاءة المهنية.`
      : `You are a smart career simulator designing realistic daily tasks professionals face. Design an interactive simulation scenario with 3 realistic daily tasks, each containing a situation and multiple choices. Evaluate interest level and professional competency.`;

    const userPrompt = isArabic
      ? `المسار: ${pathDescriptions[careerPath]?.ar || careerPath}${studentContext ? `\nسياق الطالب: ${studentContext}` : ""}\n\nصمم محاكاة تفاعلية مع 3 مهام يومية واقعية.`
      : `Path: ${pathDescriptions[careerPath]?.en || careerPath}${studentContext ? `\nStudent context: ${studentContext}` : ""}\n\nDesign interactive simulation with 3 realistic daily tasks.`;

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
        tools: [{
          type: "function",
          function: {
            name: "generate_simulation",
            description: "Generate interactive career simulation tasks",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Simulation title" },
                description: { type: "string", description: "1-2 sentence simulation overview" },
                tasks: {
                  type: "array",
                  description: "3 daily career tasks",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", description: "Task ID like task1, task2, task3" },
                      scenario: { type: "string", description: "Detailed scenario description (2-3 sentences)" },
                      role: { type: "string", description: "Professional role in this task" },
                      options: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            text: { type: "string", description: "Option text" },
                            score: { type: "number", description: "Score 0-100 for this option" },
                            feedback: { type: "string", description: "Brief feedback if chosen" },
                          },
                          required: ["text", "score", "feedback"],
                          additionalProperties: false,
                        },
                      },
                      skillsTested: {
                        type: "array",
                        items: { type: "string" },
                        description: "Skills tested by this task",
                      },
                    },
                    required: ["id", "scenario", "role", "options", "skillsTested"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["title", "description", "tasks"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_simulation" } },
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
      console.error("Simulation AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const simulation = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ simulation }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("No simulation generated");
  } catch (e) {
    console.error("simulate-tasks error:", e);
    return new Response(JSON.stringify({ error: "An internal error occurred. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
