import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const { locale } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const labels = locale === "ar" ? {
    title: "إعادة تعيين كلمة المرور",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    submit: "تحديث كلمة المرور",
    mismatch: "كلمات المرور غير متطابقة",
    success: "تم تحديث كلمة المرور بنجاح",
    error: "خطأ",
    back: "الرئيسية",
    invalidLink: "رابط غير صالح أو منتهي الصلاحية",
  } : {
    title: "Reset Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    submit: "Update Password",
    mismatch: "Passwords do not match",
    success: "Password updated successfully",
    error: "Error",
    back: "Home",
    invalidLink: "Invalid or expired reset link",
  };

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "recovery") {
      setIsRecovery(true);
    } else {
      // Also check for recovery session
      supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsRecovery(true);
        }
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: labels.error, description: labels.mismatch, variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: labels.error, description: locale === "ar" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: labels.success });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: labels.error, description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <p className="text-muted-foreground mb-4">{labels.invalidLink}</p>
          <Button onClick={() => navigate("/auth")}>{labels.back}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          {labels.back}
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6">{labels.title}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">{labels.newPassword}</Label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ps-10 pe-10"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">{labels.confirmPassword}</Label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="ps-10 pe-10"
                minLength={6}
                required
              />
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

export default ResetPasswordPage;
