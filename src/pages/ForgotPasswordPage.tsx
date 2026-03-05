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
  const { locale } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const labels = locale === "ar" ? {
    title: "نسيت كلمة المرور",
    description: "أدخل بريدك الإلكتروني وسنرسل لك رمز تحقق لإعادة تعيين كلمة المرور",
    email: "البريد الإلكتروني",
    submit: "إرسال رمز التحقق",
    back: "العودة لتسجيل الدخول",
    error: "خطأ",
    sent: "تم إرسال رمز التحقق",
  } : {
    title: "Forgot Password",
    description: "Enter your email and we'll send you a verification code to reset your password",
    email: "Email",
    submit: "Send Verification Code",
    back: "Back to Login",
    error: "Error",
    sent: "Verification code sent",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast({ title: labels.sent });
      navigate(`/verify-otp?email=${encodeURIComponent(email)}&type=recovery`);
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
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
