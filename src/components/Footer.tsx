import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import Logo from "@/components/Logo";
import Vision2030Badge from "@/components/Vision2030Badge";

const Footer: React.FC = () => {
  const { t, locale } = useLanguage();

  return (
    <footer className="py-12 gradient-hero">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-4">
          <Logo size={32} className="[&_span]:text-primary-foreground [&_svg_circle]:stroke-primary-foreground [&_svg_line]:stroke-primary-foreground" />
        </div>
        <p className="text-primary-foreground/60 text-sm mb-4">{t.footer.tagline}</p>
        <div className="flex items-center justify-center mb-4">
          <Vision2030Badge variant="light" />
        </div>
        <p className="text-primary-foreground/40 text-xs">
          © 2026 Tawajohi. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
