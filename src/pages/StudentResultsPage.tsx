import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Plus, X, Mail, Loader2, ChevronDown, ChevronUp,
  Trophy, Clock, BarChart3, User,
} from "lucide-react";

interface StudentInfo {
  user_id: string;
  username: string;
  full_name: string;
  email: string;
}

interface StudentResult {
  id: string;
  career_path: string;
  theory_score: number;
  simulation_score: number;
  total_score: number;
  duration_seconds: number | null;
  created_at: string;
}

interface ClassData {
  id: string;
  class_name: string;
  created_at: string;
  students: { email: string; info?: StudentInfo; results?: StudentResult[] }[];
}

const pathNames: Record<string, { ar: string; en: string }> = {
  health: { ar: "العلوم الصحية", en: "Health Sciences" },
  cs: { ar: "علوم الحاسب", en: "Computer Science" },
  business: { ar: "إدارة الأعمال", en: "Business" },
  shariah: { ar: "الشريعة", en: "Shari'ah" },
  general: { ar: "الاختبار العام", en: "General Exam" },
};

const StudentResultsPage: React.FC = () => {
  const { locale } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [pendingEmails, setPendingEmails] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [studentDetails, setStudentDetails] = useState<Record<string, { info?: StudentInfo; results?: StudentResult[] }>>({});

  useEffect(() => {
    if (!user) return;
    fetchClasses();
  }, [user]);

  const fetchClasses = async () => {
    setLoading(true);
    const { data: classesData } = await supabase
      .from("staff_classes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!classesData) { setLoading(false); return; }

    const classIds = classesData.map(c => c.id);
    const { data: studentsData } = classIds.length > 0
      ? await supabase.from("class_students").select("*").in("class_id", classIds)
      : { data: [] };

    const mapped: ClassData[] = classesData.map(c => ({
      id: c.id,
      class_name: c.class_name,
      created_at: c.created_at,
      students: (studentsData || []).filter(s => s.class_id === c.id).map(s => ({ email: s.student_email })),
    }));

    setClasses(mapped);
    setLoading(false);
  };

  const addEmail = () => {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(trimmed)) {
      toast({ title: locale === "ar" ? "خطأ" : "Error", description: locale === "ar" ? "بريد إلكتروني غير صالح" : "Invalid email address", variant: "destructive" });
      return;
    }
    if (pendingEmails.includes(trimmed)) {
      toast({ title: locale === "ar" ? "خطأ" : "Error", description: locale === "ar" ? "البريد مضاف مسبقاً" : "Email already added", variant: "destructive" });
      return;
    }
    if (pendingEmails.length >= 100) {
      toast({ title: locale === "ar" ? "خطأ" : "Error", description: locale === "ar" ? "الحد الأقصى 100 بريد إلكتروني لكل فصل" : "Maximum 100 emails per class", variant: "destructive" });
      return;
    }
    setPendingEmails([...pendingEmails, trimmed]);
    setEmailInput("");
  };

  const removeEmail = (email: string) => {
    setPendingEmails(pendingEmails.filter(e => e !== email));
  };

  const handleSubmitClass = async () => {
    if (!className.trim()) {
      toast({ title: locale === "ar" ? "خطأ" : "Error", description: locale === "ar" ? "أدخل اسم الفصل" : "Enter class name", variant: "destructive" });
      return;
    }
    if (pendingEmails.length === 0) {
      toast({ title: locale === "ar" ? "خطأ" : "Error", description: locale === "ar" ? "أضف بريد إلكتروني واحد على الأقل" : "Add at least one email", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { data: newClass, error: classError } = await supabase
        .from("staff_classes")
        .insert({ staff_user_id: user!.id, class_name: className.trim() })
        .select()
        .single();

      if (classError) throw classError;

      const studentRows = pendingEmails.map(email => ({
        class_id: newClass.id,
        student_email: email,
      }));

      const { error: studentsError } = await supabase
        .from("class_students")
        .insert(studentRows);

      if (studentsError) throw studentsError;

      toast({
        title: locale === "ar" ? "تم بنجاح" : "Success",
        description: locale === "ar"
          ? `تمت إضافة ${pendingEmails.length} طالب إلى الفصل "${className}" بنجاح`
          : `Successfully added ${pendingEmails.length} student(s) to class "${className}"`,
      });

      setClassName("");
      setPendingEmails([]);
      fetchClasses();
    } catch (err: any) {
      toast({ title: locale === "ar" ? "خطأ" : "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStudentDetails = async (email: string) => {
    if (expandedStudent === email) {
      setExpandedStudent(null);
      return;
    }
    setExpandedStudent(email);

    if (studentDetails[email]) return;

    try {
      const { data: infoData } = await supabase.rpc("get_student_by_email", { p_email: email });
      const info = infoData?.[0] as StudentInfo | undefined;

      let results: StudentResult[] = [];
      if (info?.user_id) {
        const { data: resultsData } = await supabase.rpc("get_student_results", { p_user_id: info.user_id });
        results = (resultsData as StudentResult[]) || [];
      }

      setStudentDetails(prev => ({
        ...prev,
        [email]: { info, results },
      }));
    } catch (err) {
      console.error("Error fetching student details:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl flex-1">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {locale === "ar" ? "نتائج الطلاب" : "Student Results"}
          </h1>
          <p className="text-muted-foreground mb-10">
            {locale === "ar" ? "إدارة الفصول ومتابعة نتائج الطلاب" : "Manage classes and track student results"}
          </p>
        </motion.div>

        {/* Add New Class */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border shadow-card p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {locale === "ar" ? "إضافة فصل جديد" : "Add New Class"}
          </h2>

          <div className="space-y-4">
            <div>
              <Label>{locale === "ar" ? "اسم الفصل" : "Class Name"}</Label>
              <Input
                value={className}
                onChange={e => setClassName(e.target.value)}
                placeholder={locale === "ar" ? "مثال: الصف الثالث - أ" : "e.g. Grade 12 - Section A"}
                className="mt-1"
              />
            </div>

            <div>
              <Label>{locale === "ar" ? "إضافة بريد إلكتروني للطالب" : "Add Student Email"}</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder={locale === "ar" ? "البريد الإلكتروني للطالب" : "student@example.com"}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addEmail())}
                />
                <Button type="button" onClick={addEmail} variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {locale === "ar" ? `${pendingEmails.length}/100 بريد إلكتروني` : `${pendingEmails.length}/100 emails`}
              </p>
            </div>

            {pendingEmails.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pendingEmails.map(email => (
                  <span key={email} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                    <Mail className="w-3 h-3" />
                    {email}
                    <button onClick={() => removeEmail(email)} className="hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <Button onClick={handleSubmitClass} disabled={submitting} className="w-full rounded-lg">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin me-2" /> : null}
              {locale === "ar" ? "تأكيد وإضافة الفصل" : "Confirm & Add Class"}
            </Button>
          </div>
        </motion.div>

        {/* Existing Classes */}
        {classes.map((cls, idx) => (
          <motion.div key={cls.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.05 }}
            className="bg-card rounded-2xl border border-border shadow-card p-8 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {cls.class_name}
              </h2>
              <span className="text-sm text-muted-foreground">
                {cls.students.length} {locale === "ar" ? "طالب" : "student(s)"}
              </span>
            </div>

            <div className="space-y-2">
              {cls.students.map(student => {
                const isExpanded = expandedStudent === student.email;
                const details = studentDetails[student.email];

                return (
                  <div key={student.email} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleStudentDetails(student.email)}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-start"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{student.email}</span>
                        {details?.info && (
                          <span className="text-xs text-muted-foreground">— {details.info.full_name || details.info.username}</span>
                        )}
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-border bg-muted/30">
                        {!details ? (
                          <div className="flex items-center gap-2 py-4 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {locale === "ar" ? "جاري التحميل..." : "Loading..."}
                          </div>
                        ) : !details.info ? (
                          <p className="text-sm text-muted-foreground py-4">
                            {locale === "ar" ? "لم يتم العثور على حساب مسجل بهذا البريد الإلكتروني" : "No registered account found with this email"}
                          </p>
                        ) : (
                          <div className="py-4 space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{details.info.full_name || details.info.username}</p>
                                <p className="text-sm text-muted-foreground">@{details.info.username}</p>
                                <p className="text-xs text-muted-foreground">{details.info.email}</p>
                              </div>
                            </div>

                            {details.results && details.results.length > 0 ? (
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  <BarChart3 className="w-4 h-4" />
                                  {locale === "ar" ? "النتائج" : "Results"}
                                </h4>
                                {details.results.map(r => (
                                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                      {pathNames[r.career_path]?.[locale] || r.career_path}
                                    </span>
                                    <div className="flex-1" />
                                    <div className="flex items-center gap-3 text-sm">
                                      <span className="text-muted-foreground">
                                        {locale === "ar" ? "نظري" : "Theory"}: {r.theory_score}%
                                      </span>
                                      <span className="text-muted-foreground">
                                        {locale === "ar" ? "عملي" : "Sim"}: {r.simulation_score}%
                                      </span>
                                      <span className={`font-bold ${r.total_score >= 80 ? "text-green-600" : r.total_score >= 60 ? "text-amber-500" : "text-destructive"}`}>
                                        {r.total_score}%
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(r.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", { month: "short", day: "numeric" })}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                {locale === "ar" ? "لا توجد نتائج اختبارات بعد" : "No test results yet"}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {classes.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {locale === "ar" ? "لم تضف أي فصل بعد" : "You haven't added any classes yet"}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default StudentResultsPage;

