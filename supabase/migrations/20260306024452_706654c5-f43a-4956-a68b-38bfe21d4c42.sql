-- Drop and recreate DELETE policy on profiles to use authenticated role
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop and recreate DELETE policy on test_results to use authenticated role
DROP POLICY IF EXISTS "Users can delete their own results" ON public.test_results;
CREATE POLICY "Users can delete their own results"
  ON public.test_results
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop and recreate UPDATE policy on test_results to use authenticated role
DROP POLICY IF EXISTS "Users can update their own results" ON public.test_results;
CREATE POLICY "Users can update their own results"
  ON public.test_results
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);