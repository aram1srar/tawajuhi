import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { locale } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const labels = locale === "ar" ? {
    title: "نسيت كلمة المرور",
    description: "أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور",
    email: "البريد الإلكتروني",
    submit: "إرسال رابط الاستعادة",
    back: "العودة لتسجيل الدخول",
    sent: "تم إرسال الرابط",
    sentDesc: "تحقق من بريدك الإلكتروني للحصول على رابط إعادة التعيين",
    error: "خطأ",
  } : {
    title: "Forgot Password",
    description: "Enter your email and we'll send you a link to reset your password",
    email: "Email",
    submit: "Send Reset Link",
    back: "Back to Login",
    sent: "Link Sent",
    sentDesc: "Check your email for a password reset link",
    error: "Error",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast({ title: labels.sent, description: labels.sentDesc });
    } catch (err: any) {
      toast({ title: labels.error, description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate("/auth")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          {labels.back}
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-2">{labels.title}</h1>
        <p className="text-muted-foreground mb-6">{labels.description}</p>

        {sent ? (
          <div className="p-4 rounded-lg bg-muted text-center">
            <p className="text-foreground font-medium">{labels.sent}</p>
            <p className="text-muted-foreground text-sm mt-1">{labels.sentDesc}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{labels.email}</Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="ps-10" required />
              </div>
            </div>
            <Button type="submit" className="w-full rounded-lg" disabled={loading}>
              {loading ? "..." : labels.submit}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
