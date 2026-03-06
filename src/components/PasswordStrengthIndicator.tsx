import React from "react";
import { getPasswordStrength } from "@/lib/password-validation";
import { Check, X } from "lucide-react";

interface Props {
  password: string;
  locale: "ar" | "en";
}

const PasswordStrengthIndicator: React.FC<Props> = ({ password, locale }) => {
  if (!password) return null;

  const strength = getPasswordStrength(password);

  const requirements = [
    { key: "length", en: "8+ characters", ar: "٨ أحرف على الأقل", met: strength.checks.length },
    { key: "uppercase", en: "Uppercase (A-Z)", ar: "حرف كبير (A-Z)", met: strength.checks.uppercase },
    { key: "lowercase", en: "Lowercase (a-z)", ar: "حرف صغير (a-z)", met: strength.checks.lowercase },
    { key: "number", en: "Number (0-9)", ar: "رقم (0-9)", met: strength.checks.number },
    { key: "symbol", en: "Symbol (!@#...)", ar: "رمز خاص (!@#...)", met: strength.checks.symbol },
  ];

  return (
    <div className="space-y-2 mt-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= strength.score ? strength.color : "bg-muted"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {locale === "ar" ? strength.labelAr : strength.label}
        </span>
      </div>

      {/* Requirements checklist */}
      <div className="grid grid-cols-2 gap-1">
        {requirements.map((req) => (
          <div key={req.key} className="flex items-center gap-1.5 text-xs">
            {req.met ? (
              <Check className="w-3 h-3 text-green-500 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-muted-foreground shrink-0" />
            )}
            <span className={req.met ? "text-foreground" : "text-muted-foreground"}>
              {locale === "ar" ? req.ar : req.en}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
