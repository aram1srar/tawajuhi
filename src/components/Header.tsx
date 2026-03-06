import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Globe, LogOut, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header: React.FC = () => {
  const { locale, setLocale, t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="Tawajohi" className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-xl text-foreground">
            {locale === "ar" ? "توجيهي" : "Tawajohi"}
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t.nav.home}
          </button>
          <button onClick={() => { navigate("/"); setTimeout(() => document.getElementById("paths")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t.nav.paths}
          </button>
          <button onClick={() => { navigate("/"); setTimeout(() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t.nav.about}
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => navigate("/my-results")}>
                <BarChart3 className="w-4 h-4 me-1" />
                {locale === "ar" ? "نتائجي" : "My Results"}
              </Button>
              <button
                onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all"
              >
                <Globe className="w-4 h-4" />
                {locale === "ar" ? "EN" : "عربي"}
              </button>
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => signOut()} title={locale === "ar" ? "تسجيل الخروج" : "Log out"}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <button
                onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all"
              >
                <Globe className="w-4 h-4" />
                {locale === "ar" ? "EN" : "عربي"}
              </button>
              <Button size="sm" className="rounded-full" onClick={() => navigate("/general-exam")}>
                {t.nav.start}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
