import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  try {
    const body = await req.json();
    const { action } = body;

    // ─── PRE-LOGIN CHECK: Rate limiting + account lock ───
    if (action === 'pre-login-check') {
      const { email } = body;
      if (!email || typeof email !== 'string') {
        return json({ allowed: false, message: 'Invalid email' }, 400);
      }

      const sanitizedEmail = email.trim().toLowerCase();

      // Rate limit: max 5 attempts per minute per email
      const oneMinAgo = new Date(Date.now() - 60_000).toISOString();
      const { count } = await adminClient
        .from('login_attempt_logs')
        .select('*', { count: 'exact', head: true })
        .eq('email_or_username', sanitizedEmail)
        .gte('attempt_time', oneMinAgo);

      if ((count || 0) >= 5) {
        return json({
          allowed: false,
          reason: 'rate_limited',
          message: 'Too many attempts, please try again later',
        });
      }

      // Check account lock
      const { data: securityInfo } = await adminClient
        .rpc('get_profile_security', { p_email: sanitizedEmail });

      const profile = securityInfo?.[0];
      if (profile?.locked_until && new Date(profile.locked_until) > new Date()) {
        const mins = Math.ceil(
          (new Date(profile.locked_until).getTime() - Date.now()) / 60_000,
        );
        return json({
          allowed: false,
          reason: 'locked',
          message: `Account locked. Try again in ${mins} minute(s)`,
        });
      }

      return json({ allowed: true });
    }

    // ─── VERIFY CREDENTIALS: Validate password server-side, generate OTP ───
    if (action === 'verify-credentials') {
      const { email, password } = body;
      if (!email || !password) {
        return json({ valid: false, message: 'Email and password required' }, 400);
      }

      const sanitizedEmail = email.trim().toLowerCase();

      // Attempt sign-in with a temporary anon client
      const tempClient = createClient(supabaseUrl, anonKey);
      const { data, error } = await tempClient.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        // Log failed attempt
        await adminClient.from('login_attempt_logs').insert({
          email_or_username: sanitizedEmail,
          success: false,
        });

        // Increment login_attempts, lock after 5 failures
        const { data: securityInfo } = await adminClient
          .rpc('get_profile_security', { p_email: sanitizedEmail });
        const profile = securityInfo?.[0];

        if (profile) {
          const attempts = (profile.login_attempts || 0) + 1;
          const updateData: Record<string, unknown> = { login_attempts: attempts };
          if (attempts >= 5) {
            updateData.locked_until = new Date(Date.now() + 15 * 60_000).toISOString();
            updateData.login_attempts = 0;
          }
          await adminClient
            .from('profiles')
            .update(updateData)
            .eq('user_id', profile.user_id);
        }

        return json({ valid: false, message: 'Invalid credentials' });
      }

      // Sign out immediately — session only created after OTP
      await tempClient.auth.signOut();

      // Log successful credential check
      await adminClient.from('login_attempt_logs').insert({
        email_or_username: sanitizedEmail,
        success: true,
      });

      // Reset login attempts
      if (data.user) {
        await adminClient
          .from('profiles')
          .update({ login_attempts: 0, locked_until: null })
          .eq('user_id', data.user.id);
      }

      // Generate 6-digit OTP
      const code = String(Math.floor(100_000 + Math.random() * 900_000));

      // Invalidate previous OTPs
      await adminClient
        .from('otp_codes')
        .update({ used: true })
        .eq('email', sanitizedEmail)
        .eq('purpose', 'login')
        .eq('used', false);

      // Store new OTP (expires in 5 minutes)
      await adminClient.from('otp_codes').insert({
        user_id: data.user!.id,
        email: sanitizedEmail,
        code,
        purpose: 'login',
        expires_at: new Date(Date.now() + 5 * 60_000).toISOString(),
      });

      // Send OTP via Resend email
      const fnUrl = `${supabaseUrl}/functions/v1/send-otp-email`;
      const emailRes = await fetch(fnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({ email: sanitizedEmail, code, purpose: 'login' }),
      });

      if (!emailRes.ok) {
        console.error('Failed to send OTP email:', await emailRes.text());
      }

      return json({
        valid: true,
        message: 'Verification code sent to your email',
      });
    }

    // ─── VERIFY OTP ───
    if (action === 'verify-otp') {
      const { email, code, purpose = 'login' } = body;
      if (!email || !code) {
        return json({ valid: false, message: 'Email and code required' }, 400);
      }

      const sanitizedEmail = email.trim().toLowerCase();

      const { data: otp } = await adminClient
        .from('otp_codes')
        .select('*')
        .eq('email', sanitizedEmail)
        .eq('code', code)
        .eq('purpose', purpose)
        .eq('used', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!otp) {
        return json({ valid: false, message: 'Invalid verification code' });
      }

      if (new Date(otp.expires_at) < new Date()) {
        await adminClient.from('otp_codes').update({ used: true }).eq('id', otp.id);
        return json({ valid: false, message: 'Verification code expired' });
      }

      await adminClient.from('otp_codes').update({ used: true }).eq('id', otp.id);
      return json({ valid: true });
    }

    // ─── RESEND OTP ───
    if (action === 'resend-otp') {
      const { email, purpose = 'login' } = body;
      if (!email) {
        return json({ success: false, message: 'Email required' }, 400);
      }

      const sanitizedEmail = email.trim().toLowerCase();

      // Rate limit: max 5 OTPs per 10 minutes
      const tenMinAgo = new Date(Date.now() - 600_000).toISOString();
      const { count } = await adminClient
        .from('otp_codes')
        .select('*', { count: 'exact', head: true })
        .eq('email', sanitizedEmail)
        .gte('created_at', tenMinAgo);

      if ((count || 0) >= 5) {
        return json({
          success: false,
          message: 'Too many OTP requests, please try again later',
        });
      }

      // Find user
      const { data: securityInfo } = await adminClient
        .rpc('get_profile_security', { p_email: sanitizedEmail });
      const profile = securityInfo?.[0];

      if (!profile) {
        return json({ success: false, message: 'User not found' });
      }

      const code = String(Math.floor(100_000 + Math.random() * 900_000));

      // Invalidate old OTPs
      await adminClient
        .from('otp_codes')
        .update({ used: true })
        .eq('email', sanitizedEmail)
        .eq('purpose', purpose)
        .eq('used', false);

      await adminClient.from('otp_codes').insert({
        user_id: profile.user_id,
        email: sanitizedEmail,
        code,
        purpose,
        expires_at: new Date(Date.now() + 5 * 60_000).toISOString(),
      });

      // Send OTP via Resend email
      const fnUrl = `${supabaseUrl}/functions/v1/send-otp-email`;
      const emailRes = await fetch(fnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({ email: sanitizedEmail, code, purpose }),
      });

      if (!emailRes.ok) {
        console.error('Failed to send OTP email:', await emailRes.text());
      }

      return json({ success: true });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (error) {
    console.error('Auth security error:', error);
    return json({ error: (error as Error).message }, 500);
  }
});
