
-- 1. Drop staff-related tables (cascade drops class_students FK)
DROP TABLE IF EXISTS public.class_students CASCADE;
DROP TABLE IF EXISTS public.staff_classes CASCADE;

-- 2. Drop staff-related RPCs
DROP FUNCTION IF EXISTS public.get_student_by_email(text);
DROP FUNCTION IF EXISTS public.get_student_results(uuid);

-- 3. Enable RLS on otp_codes and add policies
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own OTPs"
  ON public.otp_codes FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own OTPs"
  ON public.otp_codes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own OTPs"
  ON public.otp_codes FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- 4. Enable RLS on login_attempt_logs (no user access - service role only)
ALTER TABLE public.login_attempt_logs ENABLE ROW LEVEL SECURITY;
