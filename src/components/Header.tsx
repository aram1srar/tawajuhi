import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const { locale, setLocale, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">ت</span>
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            {locale === "ar" ? "توجيهي" : "Tawajohi"}
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#home" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t.nav.home}
          </a>
          <a href="#paths" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t.nav.paths}
          </a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t.nav.about}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all"
          >
            <Globe className="w-4 h-4" />
            {locale === "ar" ? "EN" : "عربي"}
          </button>
          <Button size="sm" className="rounded-full">
            {t.nav.start}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
