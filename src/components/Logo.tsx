import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 32, showText = true, className = "" }) => {
  const { locale } = useLanguage();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer ring */}
        <circle cx="24" cy="24" r="22" stroke="hsl(var(--primary))" strokeWidth="2.5" opacity="0.3" />
        <circle cx="24" cy="24" r="18" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.15" />
        
        {/* Compass points */}
        {/* North */}
        <path d="M24 4 L26.5 20 L24 18 L21.5 20 Z" fill="hsl(var(--accent))" />
        {/* South */}
        <path d="M24 44 L26.5 28 L24 30 L21.5 28 Z" fill="hsl(var(--primary))" opacity="0.5" />
        {/* East */}
        <path d="M44 24 L28 21.5 L30 24 L28 26.5 Z" fill="hsl(var(--primary))" opacity="0.5" />
        {/* West */}
        <path d="M4 24 L20 21.5 L18 24 L20 26.5 Z" fill="hsl(var(--primary))" opacity="0.5" />
        
        {/* Inner compass rose */}
        <path d="M24 8 L27 21 L24 24 L21 21 Z" fill="hsl(var(--primary))" />
        <path d="M24 40 L27 27 L24 24 L21 27 Z" fill="hsl(var(--primary))" opacity="0.6" />
        <path d="M8 24 L21 21 L24 24 L21 27 Z" fill="hsl(var(--primary))" opacity="0.4" />
        <path d="M40 24 L27 21 L24 24 L27 27 Z" fill="hsl(var(--primary))" opacity="0.4" />
        
        {/* Center dot */}
        <circle cx="24" cy="24" r="3" fill="hsl(var(--accent))" />
        <circle cx="24" cy="24" r="1.5" fill="hsl(var(--primary))" />
        
        {/* Cardinal tick marks */}
        <line x1="24" y1="2" x2="24" y2="5" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" />
        <line x1="46" y1="24" x2="43" y2="24" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="24" y1="46" x2="24" y2="43" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="2" y1="24" x2="5" y2="24" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
      {showText && (
        <span className="font-display font-bold text-xl text-foreground">
          {locale === "ar" ? "توجيهي" : "Tawajohi"}
        </span>
      )}
    </div>
  );
};

export default Logo;
