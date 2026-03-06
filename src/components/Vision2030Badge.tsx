import React from "react";

interface Vision2030BadgeProps {
  className?: string;
  variant?: "light" | "dark";
}

const Vision2030Badge: React.FC<Vision2030BadgeProps> = ({ className = "", variant = "light" }) => {
  const textColor = variant === "light" ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))";
  const accentColor = "hsl(var(--accent))";
  const primaryColor = variant === "light" ? "hsl(var(--primary-foreground))" : "hsl(var(--primary))";

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Stylized geometric mark inspired by Vision 2030 */}
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hexagonal shape */}
        <path
          d="M24 4 L40 14 L40 34 L24 44 L8 34 L8 14 Z"
          stroke={primaryColor}
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
        />
        {/* Inner star / palm frond abstraction */}
        <path d="M24 10 L26 22 L24 24 L22 22 Z" fill={accentColor} />
        <path d="M24 38 L26 26 L24 24 L22 26 Z" fill={primaryColor} opacity="0.5" />
        <path d="M12 17 L22 22 L24 24 L22 26 Z" fill={primaryColor} opacity="0.3" />
        <path d="M36 17 L26 22 L24 24 L26 26 Z" fill={primaryColor} opacity="0.3" />
        <path d="M12 31 L22 26 L24 24 L22 22 Z" fill={primaryColor} opacity="0.2" />
        <path d="M36 31 L26 26 L24 24 L26 22 Z" fill={primaryColor} opacity="0.2" />
        {/* Center */}
        <circle cx="24" cy="24" r="2.5" fill={accentColor} />
      </svg>
      
      {/* Text */}
      <div className="flex flex-col leading-tight">
        <span
          className="text-xs font-medium tracking-widest uppercase"
          style={{ color: primaryColor, opacity: 0.6 }}
        >
          Saudi
        </span>
        <span
          className="text-lg font-display font-bold tracking-tight"
          style={{ color: primaryColor }}
        >
          Vision <span style={{ color: accentColor }}>2030</span>
        </span>
      </div>
    </div>
  );
};

export default Vision2030Badge;
