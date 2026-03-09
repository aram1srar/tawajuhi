
-- 1. Replace the permissive UPDATE policy on profiles with one that
--    prevents modification of security-sensitive columns via a trigger.
-- Drop the old policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a trigger that blocks changes to security-sensitive columns
CREATE OR REPLACE FUNCTION public.protect_profile_security_fields()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = 'public'
AS $$
BEGIN
  -- Preserve security-sensitive fields from their OLD values
  NEW.locked_until := OLD.locked_until;
  NEW.login_attempts := OLD.login_attempts;
  NEW.user_type := OLD.user_type;
  NEW.role_confirmed := OLD.role_confirmed;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_profile_security_fields_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_security_fields();

-- Re-create the UPDATE policy (owner-scoped)
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Drop the get_profile_security RPC that exposes user data by email
DROP FUNCTION IF EXISTS public.get_profile_security(text);
