import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Mail, Lock, User, ArrowLeft, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

// Simple math CAPTCHA
function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { question: `${a} + ${b}`, answer: a + b };
}

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const { signIn, signUp, user: currentUser } = useAuth();
  const { locale, setLocale } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  }, []);

  useEffect(() => {
    refreshCaptcha();
  }, [mode, refreshCaptcha]);

  // Redirect if already logged in (e.g. after Google OAuth)
  useEffect(() => {
    if (currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  const labels = locale === "ar" ? {
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    username: "اسم المستخدم",
    submit: mode === "login" ? "دخول" : "إنشاء",
    back: "الرئيسية",
    welcome: "مرحباً بك في توجيهي",
    subtitle: "سجل الدخول لاكتشاف مسارك المهني",
    orContinue: "أو تابع باستخدام",
    google: "Google",
    captchaLabel: "أثبت أنك إنسان",
    captchaError: "الإجابة غير صحيحة",
  } : {
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    username: "Username",
    submit: mode === "login" ? "Sign In" : "Create Account",
    back: "Home",
    welcome: "Welcome to Tawajohi",
    subtitle: "Sign in to discover your career path",
    orContinue: "Or continue with",
    google: "Google",
    captchaLabel: "Prove you're human",
    captchaError: "Incorrect answer",
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (err: any) {
      toast({ title: locale === "ar" ? "خطأ" : "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate CAPTCHA on signup
    if (mode === "signup" && parseInt(captchaInput) !== captcha.answer) {
      toast({ title: locale === "ar" ? "خطأ" : "Error", description: labels.captchaError, variant: "destructive" });
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/dashboard");
      } else {
        const { error } = await signUp(email, password, username);
        if (error) throw error;
        toast({
          title: locale === "ar" ? "تم إنشاء الحساب" : "Account created",
          description: locale === "ar" ? "تحقق من بريدك الإلكتروني للتفعيل" : "Check your email for verification",
        });
      }
    } catch (err: any) {
      toast({ title: locale === "ar" ? "خطأ" : "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-background">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center justify-between mb-10">
            <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {labels.back}
            </button>
            <button
              onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground transition-all"
            >
              <Globe className="w-4 h-4" />
              {locale === "ar" ? "EN" : "عربي"}
            </button>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">ت</span>
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                {locale === "ar" ? "توجيهي" : "Tawajohi"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{labels.welcome}</h1>
            <p className="text-muted-foreground">{labels.subtitle}</p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-lg bg-muted p-1 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {labels.login}
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {labels.signup}
            </button>
          </div>

          {/* Google Sign-In */}
          <Button
            variant="outline"
            className="w-full rounded-lg mb-4 gap-2"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {labels.orContinue} {labels.google}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {locale === "ar" ? "أو" : "or"}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === "login" ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "login" ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="username">{labels.username}</Label>
                  <div className="relative">
                    <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="ps-10" required />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{labels.email}</Label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="ps-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{labels.password}</Label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
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

              {/* CAPTCHA on signup */}
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label>{labels.captchaLabel}</Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border">
                    <span className="font-mono text-lg font-bold text-foreground select-none">
                      {captcha.question} = ?
                    </span>
                    <Input
                      type="number"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      className="w-20 text-center"
                      required
                    />
                    <button type="button" onClick={refreshCaptcha} className="text-muted-foreground hover:text-foreground transition-colors">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full rounded-lg" disabled={loading}>
                {loading ? "..." : labels.submit}
              </Button>

              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
                >
                  {locale === "ar" ? "نسيت كلمة المرور؟" : "Forgot Password?"}
                </button>
              )}
            </motion.form>
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-16">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-3xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-8">
            <span className="text-5xl text-primary-foreground font-bold">ت</span>
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            {locale === "ar" ? "اكتشف مسارك المهني" : "Discover Your Path"}
          </h2>
          <p className="text-primary-foreground/60 leading-relaxed">
            {locale === "ar"
              ? "محاكاة واقعية وتقييم ذكي يساعدك في اختيار المسار الأنسب لمستقبلك"
              : "Real-world simulations and AI-powered assessment to help you choose the right career"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
