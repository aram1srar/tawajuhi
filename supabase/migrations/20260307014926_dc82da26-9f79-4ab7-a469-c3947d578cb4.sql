
-- Add user_type column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type text NOT NULL DEFAULT 'student';

-- Add unique constraint on username
ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);

-- Create staff_classes table
CREATE TABLE public.staff_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view own classes" ON public.staff_classes
  FOR SELECT TO authenticated USING (auth.uid() = staff_user_id);

CREATE POLICY "Staff can insert own classes" ON public.staff_classes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = staff_user_id);

CREATE POLICY "Staff can update own classes" ON public.staff_classes
  FOR UPDATE TO authenticated USING (auth.uid() = staff_user_id);

CREATE POLICY "Staff can delete own classes" ON public.staff_classes
  FOR DELETE TO authenticated USING (auth.uid() = staff_user_id);

-- Create class_students table (linking students to classes by email)
CREATE TABLE public.class_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.staff_classes(id) ON DELETE CASCADE,
  student_email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(class_id, student_email)
);

ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;

-- Staff can manage students in their own classes
CREATE POLICY "Staff can view class students" ON public.class_students
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.staff_classes WHERE id = class_id AND staff_user_id = auth.uid())
  );

CREATE POLICY "Staff can insert class students" ON public.class_students
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.staff_classes WHERE id = class_id AND staff_user_id = auth.uid())
  );

CREATE POLICY "Staff can delete class students" ON public.class_students
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.staff_classes WHERE id = class_id AND staff_user_id = auth.uid())
  );

-- Function to look up student info by email (security definer so staff can see student data)
CREATE OR REPLACE FUNCTION public.get_student_by_email(p_email text)
RETURNS TABLE(user_id uuid, username text, full_name text, email text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id as user_id, p.username, p.full_name, u.email
  FROM auth.users u
  JOIN public.profiles p ON p.user_id = u.id
  WHERE u.email = p_email;
$$;

-- Function to get student results by user_id (security definer for staff access)
CREATE OR REPLACE FUNCTION public.get_student_results(p_user_id uuid)
RETURNS SETOF public.test_results
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.test_results WHERE user_id = p_user_id ORDER BY created_at DESC;
$$;

-- Function to check if username is taken
CREATE OR REPLACE FUNCTION public.is_username_taken(p_username text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE username = p_username);
$$;
