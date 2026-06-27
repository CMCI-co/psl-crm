// LoginPage.tsx — sign-in. In demo mode (no Supabase keys) it explains that the
// app is running on bundled demo data and links straight in. When Supabase is
// configured it offers a magic-link sign-in.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/theme/useTheme';
import { UI, SERIF } from '@/theme/tokens';
import { Button } from '@/components/ui';
import { isSupabaseConfigured } from '@/env';
import { supabase } from '@/lib/supabase';

export function LoginPage() {
  const { t } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const sendLink = async () => {
    if (!supabase || !email) return;
    setBusy(true); setErr(null);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    setBusy(false);
    if (error) setErr(error.message); else setSent(true);
  };

  return (
    <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.panel, padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 16, padding: '34px 30px', boxShadow: '0 10px 40px rgba(15,20,32,.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: t.accent, color: t.onAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: 17 }}>ΦΣΛ</span>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 18, color: t.ink, lineHeight: 1.1 }}>Phi Sigma Lambda</div>
            <div style={{ fontFamily: UI, fontSize: 12, color: t.faint }}>Chapter CRM</div>
          </div>
        </div>

        {!isSupabaseConfigured ? (
          <>
            <div style={{ fontFamily: UI, fontSize: 13.5, color: t.sub, lineHeight: 1.55, marginBottom: 18 }}>
              Running in <strong style={{ color: t.ink }}>demo mode</strong> with bundled sample data — no sign-in required. Add Supabase keys to <code style={{ fontFamily: UI, background: t.panel2, padding: '1px 6px', borderRadius: 5 }}>.env</code> to enable live accounts.
            </div>
            <Button label="Enter the demo" kind="primary" full onClick={() => navigate('/directory/active')} />
          </>
        ) : sent ? (
          <div style={{ fontFamily: UI, fontSize: 13.5, color: t.sub, lineHeight: 1.55 }}>
            Check <strong style={{ color: t.ink }}>{email}</strong> for a sign-in link.
          </div>
        ) : (
          <>
            <label style={{ display: 'block', fontFamily: UI, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: t.faint, marginBottom: 7 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@chapter.org"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1px solid ${t.line}`, background: t.bg, color: t.ink, fontFamily: UI, fontSize: 13.5, outline: 'none', marginBottom: 14 }}
            />
            {err && <div style={{ fontFamily: UI, fontSize: 12, color: '#b3402f', marginBottom: 12 }}>{err}</div>}
            <Button label={busy ? 'Sending…' : 'Send magic link'} kind="primary" full disabled={busy || !email} onClick={sendLink} />
          </>
        )}
      </div>
    </div>
  );
}
