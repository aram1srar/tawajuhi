import { supabase } from "@/integrations/supabase/client";

export interface PasswordStrength {
  score: number; // 0-5
  label: string;
  labelAr: string;
  color: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    symbol: boolean;
  };
}

export function getPasswordStrength(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  const labels: Record<number, { en: string; ar: string; color: string }> = {
    0: { en: "Very Weak", ar: "ضعيفة جداً", color: "bg-destructive" },
    1: { en: "Weak", ar: "ضعيفة", color: "bg-destructive" },
    2: { en: "Fair", ar: "مقبولة", color: "bg-orange-500" },
    3: { en: "Good", ar: "جيدة", color: "bg-yellow-500" },
    4: { en: "Strong", ar: "قوية", color: "bg-green-500" },
    5: { en: "Very Strong", ar: "قوية جداً", color: "bg-green-600" },
  };

  const info = labels[score];
  return {
    score,
    label: info.en,
    labelAr: info.ar,
    color: info.color,
    checks,
  };
}

export function getClientErrors(password: string, locale: "en" | "ar"): string[] {
  const errors: string[] = [];
  if (password.length < 8) errors.push(locale === "ar" ? "8 أحرف على الأقل" : "At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push(locale === "ar" ? "حرف كبير" : "Uppercase letter");
  if (!/[a-z]/.test(password)) errors.push(locale === "ar" ? "حرف صغير" : "Lowercase letter");
  if (!/[0-9]/.test(password)) errors.push(locale === "ar" ? "رقم" : "Number");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) errors.push(locale === "ar" ? "رمز خاص" : "Special character");
  return errors;
}

export async function checkPasswordServer(password: string): Promise<{ valid: boolean; breached: boolean; errors: string[] }> {
  try {
    const { data, error } = await supabase.functions.invoke("check-password", {
      body: { password },
    });
    if (error) throw error;
    return data;
  } catch {
    // If server check fails, allow (don't block user)
    return { valid: true, breached: false, errors: [] };
  }
}
