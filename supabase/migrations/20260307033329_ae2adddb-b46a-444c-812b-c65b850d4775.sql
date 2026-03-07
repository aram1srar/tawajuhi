
-- Login attempt logs table (service role access only via RLS bypass)
CREATE TABLE IF NOT EXISTS public.login_attempt_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_or_username text NOT NULL,
  ip_address text DEFAULT 'unknown',
  attempt_time timestamptz NOT NULL DEFAULT now(),
  success boolean NOT NULL DEFAULT false
);
ALTER TABLE public.login_attempt_logs ENABLE ROW LEVEL SECURITY;

-- OTP codes table (service role access only via RLS bypass)
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text NOT NULL,
  code text NOT NULL,
  purpose text NOT NULL DEFAULT 'login',
  expires_at timestamptz NOT NULL,
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Add security fields to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS locked_until timestamptz,
  ADD COLUMN IF NOT EXISTS login_attempts integer NOT NULL DEFAULT 0;

-- Helper function to get profile security info by email
CREATE OR REPLACE FUNCTION public.get_profile_security(p_email text)
RETURNS TABLE(user_id uuid, locked_until timestamptz, login_attempts integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id, p.locked_until, p.login_attempts
  FROM auth.users u
  JOIN public.profiles p ON p.user_id = u.id
  WHERE u.email = p_email
  LIMIT 1;
$$;

-- Cleanup function for expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.otp_codes WHERE expires_at < now() OR used = true;
$$;
