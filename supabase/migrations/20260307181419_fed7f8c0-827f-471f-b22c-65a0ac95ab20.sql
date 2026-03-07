
-- Enforce student-only: any insert/update on profiles forces user_type to 'student'
CREATE OR REPLACE FUNCTION public.enforce_student_only()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.user_type := 'student';
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_student_user_type
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_student_only();
