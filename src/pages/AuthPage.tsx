import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const labels = locale === "ar" ? {
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    username: "اسم المستخدم",
    switchToSignup: "ليس لديك حساب؟ أنشئ واحداً",
    switchToLogin: "لديك حساب بالفعل؟ سجل الدخول",
    submit: mode === "login" ? "دخول" : "إنشاء",
    back: "الرئيسية",
    welcome: "مرحباً بك في توجيهي",
    subtitle: "سجل الدخول لاكتشاف مسارك المهني",
  } : {
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    username: "Username",
    switchToSignup: "Don't have an account? Sign up",
    switchToLogin: "Already have an account? Log in",
    submit: mode === "login" ? "Sign In" : "Create Account",
    back: "Home",
    welcome: "Welcome to Tawajohi",
    subtitle: "Sign in to discover your career path",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: err.message,
        variant: "destructive",
      });
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
          <div className="flex rounded-lg bg-muted p-1 mb-8">
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

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === "login" ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "login" ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="username">{labels.username}</Label>
                  <div className="relative">
                    <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="ps-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{labels.email}</Label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ps-10"
                    required
                  />
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

              <Button type="submit" className="w-full rounded-lg" disabled={loading}>
                {loading ? "..." : labels.submit}
              </Button>
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
