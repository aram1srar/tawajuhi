import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, ShieldCheck, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MAX_ATTEMPTS = 5;
const OTP_LENGTH = 6;

const VerifyOtpPage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const type = (searchParams.get("type") || "signup") as "signup" | "recovery";
  const { locale } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const labels = locale === "ar" ? {
    title: type === "signup" ? "تأكيد البريد الإلكتروني" : "إعادة تعيين كلمة المرور",
    subtitle: "أدخل رمز التحقق المكون من 6 أرقام المرسل إلى",
    otpLabel: "رمز التحقق",
    submit: "تحقق",
    resend: "إعادة إرسال الرمز",
    resendIn: "إعادة الإرسال بعد",
    seconds: "ثانية",
    back: "العودة",
    success: type === "signup" ? "تم تفعيل الحساب بنجاح" : "تم التحقق",
    error: "خطأ",
    invalidOtp: "رمز التحقق غير صحيح أو منتهي الصلاحية",
    maxAttempts: "تم تجاوز الحد الأقصى للمحاولات. يرجى طلب رمز جديد",
    otpSent: "تم إرسال رمز جديد",
    expiry: "صلاحية الرمز 10 دقائق",
    warning: "لا تشارك هذا الرمز مع أي شخص",
    attemptsLeft: "محاولات متبقية",
  } : {
    title: type === "signup" ? "Verify Your Email" : "Reset Password",
    subtitle: "Enter the 6-digit code sent to",
    otpLabel: "Verification Code",
    submit: "Verify",
    resend: "Resend Code",
    resendIn: "Resend in",
    seconds: "s",
    back: "Back",
    success: type === "signup" ? "Account verified successfully" : "Verified",
    error: "Error",
    invalidOtp: "Invalid or expired verification code",
    maxAttempts: "Maximum attempts reached. Please request a new code",
    otpSent: "New code sent",
    expiry: "Code expires in 10 minutes",
    warning: "Do not share this code with anyone",
    attemptsLeft: "attempts left",
  };

  useEffect(() => {
    if (!email) navigate("/auth", { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= MAX_ATTEMPTS) {
      toast({ title: labels.error, description: labels.maxAttempts, variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: type === "signup" ? "signup" : "recovery",
      });
      if (error) throw error;

      setAttempts(0);
      toast({ title: labels.success });

      if (type === "recovery") {
        navigate("/reset-password", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      const remaining = MAX_ATTEMPTS - newAttempts;
      toast({
        title: labels.error,
        description: remaining > 0
          ? `${labels.invalidOtp} (${remaining} ${labels.attemptsLeft})`
          : labels.maxAttempts,
        variant: "destructive",
      });
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      if (type === "signup") {
        const { error } = await supabase.auth.resend({ type: "signup", email });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
      }
      setAttempts(0);
      setResendCooldown(60);
      toast({ title: labels.otpSent });
    } catch (err: any) {
      toast({ title: labels.error, description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const isLocked = attempts >= MAX_ATTEMPTS;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(type === "signup" ? "/auth" : "/forgot-password")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {labels.back}
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{labels.title}</h1>
            <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted mb-6">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{email}</span>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{labels.otpLabel}</label>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))}
              className="text-center text-2xl tracking-[0.5em] font-mono"
              placeholder="••••••"
              disabled={isLocked}
              required
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{labels.expiry}</span>
            {attempts > 0 && !isLocked && (
              <span className="text-destructive">
                {MAX_ATTEMPTS - attempts} {labels.attemptsLeft}
              </span>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg"
            disabled={loading || otp.length !== OTP_LENGTH || isLocked}
          >
            {loading ? "..." : labels.submit}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={loading || resendCooldown > 0}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-3 h-3" />
              {resendCooldown > 0
                ? `${labels.resendIn} ${resendCooldown}${labels.seconds}`
                : labels.resend}
            </button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-2">
            ⚠️ {labels.warning}
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
