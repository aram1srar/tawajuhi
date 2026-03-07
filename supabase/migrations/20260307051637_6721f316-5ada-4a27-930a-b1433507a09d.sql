
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role_confirmed boolean NOT NULL DEFAULT false;

-- Update existing profiles to mark them as confirmed (they already chose their role)
UPDATE public.profiles SET role_confirmed = true;

-- Update the handle_new_user trigger to set role_confirmed based on whether user_type was explicitly provided
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, username, full_name, user_type, role_confirmed)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student'),
    CASE WHEN NEW.raw_user_meta_data->>'user_type' IS NOT NULL THEN true ELSE false END
  );
  RETURN NEW;
END;
$function$;
