import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RoleSelectionModalProps {
  userId: string;
  onComplete: (role: string) => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ userId, onComplete }) => {
  const { locale } = useLanguage();
  const { toast } = useToast();
  const [selected, setSelected] = useState<"student" | "academic_staff" | null>(null);
  const [loading, setLoading] = useState(false);

  const labels = locale === "ar" ? {
    title: "اختر نوع حسابك",
    subtitle: "يرجى تحديد دورك للمتابعة",
    student: "طالب",
    studentDesc: "أبحث عن مساري المهني وأرغب بخوض الاختبارات",
    staff: "كادر أكاديمي",
    staffDesc: "أشرف على طلاب وأتابع نتائجهم",
    confirm: "متابعة",
  } : {
    title: "Choose Your Role",
    subtitle: "Please select your role to continue",
    student: "Student",
    studentDesc: "I'm exploring career paths and taking assessments",
    staff: "Academic Staff",
    staffDesc: "I manage students and track their results",
    confirm: "Continue",
  };

  const handleConfirm = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ user_type: selected, role_confirmed: true } as any)
        .eq("user_id", userId);
      if (error) throw error;
      onComplete(selected);
    } catch (err: any) {
      toast({ title: locale === "ar" ? "خطأ" : "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{labels.title}</h2>
          <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setSelected("student")}
            className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-start ${
              selected === "student"
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{labels.student}</p>
              <p className="text-sm text-muted-foreground">{labels.studentDesc}</p>
            </div>
          </button>

          <button
            onClick={() => setSelected("academic_staff")}
            className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-start ${
              selected === "academic_staff"
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{labels.staff}</p>
              <p className="text-sm text-muted-foreground">{labels.staffDesc}</p>
            </div>
          </button>
        </div>

        <Button
          className="w-full rounded-xl"
          disabled={!selected || loading}
          onClick={handleConfirm}
        >
          {loading ? "..." : labels.confirm}
        </Button>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
