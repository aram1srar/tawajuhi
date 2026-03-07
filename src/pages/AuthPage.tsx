import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Globe, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator";
import { getPasswordStrength, checkPasswordServer } from "@/lib/password-validation";

import logoImg from "@/assets/logo-new.png";

const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || "a454f292-79ba-429e-98ac-401823442df6";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [authStep, setAuthStep] = useState<"form" | "verification-sent">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const hcaptchaRef = useRef<HCaptcha>(null);
  const { signIn, signUp, user: currentUser } = useAuth();
  const { locale, setLocale } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const onHCaptchaVerify = useCallback((token: string) => {
    setHcaptchaToken(token);
  }, []);

  const onHCaptchaExpire = useCallback(() => {
    setHcaptchaToken(null);
  }, []);

  // Reset captcha when switching modes
  useEffect(() => {
    setHcaptchaToken(null);
    hcaptchaRef.current?.resetCaptcha();
    setAuthStep("form");
  }, [mode]);

  // Redirect after login
  useEffect(() => {
    if (currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  // Check username availability with debounce
  useEffect(() => {
    if (mode !== "signup" || !username.trim()) {
      setUsernameError(null);
      return;
    }
    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const { data } = await supabase.rpc("is_username_taken", { p_username: username.trim() });
        if (data === true) {
          setUsernameError(locale === "ar" ? "اسم المستخدم مأخوذ بالفعل" : "Username already taken");
        } else {
          setUsernameError(null);
        }
      } catch {
        setUsernameError(null);
      }
      setCheckingUsername(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [username, mode, locale]);

  const labels = locale === "ar" ? {
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    username: "اسم المستخدم",
    submit: mode === "login" ? "دخول" : "إنشاء",
    back: "الرئيسية",
    welcome: "مرحباً بك في توجُّهي",
    subtitle: "سجل الدخول لاكتشاف مسارك المهني",
    orContinue: "أو تابع باستخدام",
    google: "Google",
    fullName: "الاسم الكامل",
    captchaError: "يرجى إكمال التحقق",
    emailExists: "البريد الإلكتروني مسجل مسبقاً",
    rateLimited: "محاولات كثيرة، حاول مرة أخرى لاحقاً",
    accountLocked: "الحساب مقفل مؤقتاً",
  } : {
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    username: "Username",
    submit: mode === "login" ? "Sign In" : "Create Account",
    back: "Home",
    welcome: "Welcome to Tawajuhi",
    subtitle: "Sign in to discover your career path",
    orContinue: "Or continue with",
    google: "Google",
    fullName: "Full Name",
    captchaError: "Please complete the captcha",
    emailExists: "This email is already registered",
    rateLimited: "Too many attempts, please try again later",
    accountLocked: "Account temporarily locked",
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

  const handleLoginSubmit = async () => {
    setLoading(true);
    try {
      // Step 1: Pre-login security check (rate limit + account lock)
      const { data: checkData, error: checkError } = await supabase.functions.invoke("auth-security", {
        body: { action: "pre-login-check", email },
      });

      if (checkError) throw new Error(checkError.message);
      if (!checkData.allowed) {
        toast({
          title: locale === "ar" ? "خطأ" : "Error",
          description: checkData.message,
          variant: "destructive",
        });
        return;
      }

      // Step 2: Sign in directly
      const { error } = await signIn(email, password);
      if (error) {
        // Handle unverified email
        if (error.message?.includes("Email not confirmed")) {
          // Resend confirmation link
          await supabase.auth.resend({
            type: 'signup',
            email: email.trim().toLowerCase(),
            options: { emailRedirectTo: window.location.origin },
          });
          setPendingEmail(email);
          setAuthStep("verification-sent");
          toast({
            title: locale === "ar" ? "تنبيه" : "Notice",
            description: locale === "ar" ? "بريدك غير مفعل. تم إرسال رابط تأكيد جديد." : "Email not verified. A new confirmation link has been sent.",
          });
          return;
        }

        // Log failed attempt server-side
        await supabase.functions.invoke("auth-security", {
          body: { action: "log-failed-login", email },
        });

        toast({
          title: locale === "ar" ? "خطأ" : "Error",
          description: locale === "ar" ? "بيانات الدخول غير صحيحة" : "Invalid credentials",
          variant: "destructive",
        });
        return;
      }
      // Redirect handled by useEffect
    } catch (err: any) {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async () => {
    // Validate hCaptcha
    if (!hcaptchaToken) {
      toast({ title: locale === "ar" ? "خطأ" : "Error", description: labels.captchaError, variant: "destructive" });
      return;
    }

    // Validate password strength
    const strength = getPasswordStrength(password);
    if (strength.score < 5) {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: locale === "ar" ? "كلمة المرور لا تستوفي جميع المتطلبات" : "Password does not meet all requirements",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Server-side breach check
    const serverCheck = await checkPasswordServer(password);
    if (!serverCheck.valid) {
      setLoading(false);
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: serverCheck.errors[0] || (locale === "ar" ? "كلمة المرور غير آمنة" : "Password is not safe"),
        variant: "destructive",
      });
      return;
    }

    try {
      if (usernameError) {
        toast({ title: locale === "ar" ? "خطأ" : "Error", description: usernameError, variant: "destructive" });
        return;
      }
      const { error } = await signUp(email, password, username, fullName, userType);
      if (error) {
        if (error.message?.includes("already registered") || error.message?.includes("already been registered")) {
          toast({ title: locale === "ar" ? "خطأ" : "Error", description: labels.emailExists, variant: "destructive" });
        } else {
          throw error;
        }
        return;
      }
      // Show verification-sent screen
      setPendingEmail(email);
      setAuthStep("verification-sent");
    } catch (err: any) {
      toast({ title: locale === "ar" ? "خطأ" : "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      await handleLoginSubmit();
    } else {
      await handleSignupSubmit();
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
              <img src={logoImg} alt="Tawajuhi" className="w-8 h-8 object-contain" />
              <span className="font-display font-bold text-lg text-foreground">
                {locale === "ar" ? "توجُّهي" : "Tawajuhi"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{labels.welcome}</h1>
            <p className="text-muted-foreground">{labels.subtitle}</p>
          </div>

          {/* Verification Sent Screen */}
          {authStep === "verification-sent" ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {locale === "ar" ? "تحقق من بريدك الإلكتروني" : "Check Your Email"}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {locale === "ar"
                    ? "لقد أرسلنا رابط تأكيد إلى"
                    : "We've sent a confirmation link to"}
                </p>
                <p className="font-medium text-foreground mt-1">{pendingEmail}</p>
                <p className="text-sm text-muted-foreground mt-3">
                  {locale === "ar"
                    ? "انقر على الرابط في بريدك الإلكتروني لتفعيل حسابك والعودة إلى التطبيق."
                    : "Click the link in your email to verify your account and return to the app."}
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-lg gap-2"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    const { error } = await supabase.auth.resend({
                      type: 'signup',
                      email: pendingEmail,
                      options: { emailRedirectTo: window.location.origin },
                    });
                    if (error) throw error;
                    toast({
                      title: locale === "ar" ? "تم" : "Sent",
                      description: locale === "ar" ? "تم إعادة إرسال رابط التأكيد" : "Confirmation link resent",
                    });
                  } catch (err: any) {
                    toast({
                      title: locale === "ar" ? "خطأ" : "Error",
                      description: err.message,
                      variant: "destructive",
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? "..." : (locale === "ar" ? "إعادة إرسال رابط التأكيد" : "Resend Confirmation Link")}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setAuthStep("form");
                  setPendingEmail("");
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {locale === "ar" ? "رجوع لتسجيل الدخول" : "Back to Login"}
              </button>
            </div>
          ) : (
            <>
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
                  {/* User Type Dropdown */}
                  <div className="space-y-2">
                    <Label>{labels.userType}</Label>
                    <Select value={userType} onValueChange={(v) => setUserType(v as "student" | "academic_staff")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">{labels.student}</SelectItem>
                        <SelectItem value="academic_staff">{labels.academicStaff}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="username">{labels.username}</Label>
                      <div className="relative">
                        <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className={`ps-10 ${usernameError ? "border-destructive" : ""}`} required />
                      </div>
                      {usernameError && (
                        <p className="text-xs text-destructive">{usernameError}</p>
                      )}
                    </div>
                  )}

                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{labels.fullName}</Label>
                      <div className="relative">
                        <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="ps-10" required />
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
                    {mode === "signup" && (
                      <PasswordStrengthIndicator password={password} locale={locale as "ar" | "en"} />
                    )}
                  </div>

                  {/* hCaptcha on signup */}
                  {mode === "signup" && (
                    <div className="flex justify-center">
                      <HCaptcha
                        ref={hcaptchaRef}
                        sitekey={HCAPTCHA_SITE_KEY}
                        onVerify={onHCaptchaVerify}
                        onExpire={onHCaptchaExpire}
                        languageOverride={locale === "ar" ? "ar" : "en"}
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full rounded-lg" disabled={loading || (mode === "signup" && !hcaptchaToken)}>
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
            </>
          )}
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-16">
        <div className="text-center max-w-md">
          <img src={logoImg} alt="Tawajuhi" className="w-24 h-24 object-contain mx-auto mb-8" />
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
