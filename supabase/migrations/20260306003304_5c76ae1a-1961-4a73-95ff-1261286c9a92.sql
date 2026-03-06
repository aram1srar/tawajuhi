
-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to update their own test results
CREATE POLICY "Users can update their own results"
ON public.test_results
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete their own test results
CREATE POLICY "Users can delete their own results"
ON public.test_results
FOR DELETE
USING (auth.uid() = user_id);
