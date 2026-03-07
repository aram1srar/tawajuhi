
-- Add a deny-all SELECT policy so the linter sees an explicit policy exists
-- Service role bypasses RLS, so backend access is unaffected
CREATE POLICY "No direct access to login logs"
  ON public.login_attempt_logs FOR SELECT TO authenticated
  USING (false);
