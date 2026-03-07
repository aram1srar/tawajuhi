import React, { useState, useEffect } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw } from "lucide-react";

interface OTPVerificationProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  loading: boolean;
  locale: "ar" | "en";
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerify,
  onResend,
  onBack,
  loading,
  locale,
}) => {
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    await onResend();
    setCountdown(300);
    setResendCooldown(60);
    setCode("");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const labels =
    locale === "ar"
      ? {
          title: "التحقق من الهوية",
          subtitle: "أدخل رمز التحقق المرسل إلى",
          verify: "تحقق",
          resend: "إعادة إرسال الرمز",
          expires: "ينتهي خلال",
          expired: "انتهت صلاحية الرمز",
          back: "رجوع",
        }
      : {
          title: "Identity Verification",
          subtitle: "Enter the verification code sent to",
          verify: "Verify",
          resend: "Resend Code",
          expires: "Expires in",
          expired: "Code expired",
          back: "Back",
        };

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground">{labels.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {labels.subtitle}{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="flex justify-center" dir="ltr">
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <span className="mx-2 text-muted-foreground">-</span>
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {countdown > 0 ? (
        <p className="text-sm text-muted-foreground">
          {labels.expires}:{" "}
          <span className="font-mono font-medium">{formatTime(countdown)}</span>
        </p>
      ) : (
        <p className="text-sm text-destructive">{labels.expired}</p>
      )}

      <Button
        onClick={() => onVerify(code)}
        disabled={code.length !== 6 || loading || countdown <= 0}
        className="w-full rounded-lg"
      >
        {loading ? "..." : labels.verify}
      </Button>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {labels.back}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || loading}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className="w-3 h-3" />
          {resendCooldown > 0
            ? `${labels.resend} (${resendCooldown}s)`
            : labels.resend}
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
