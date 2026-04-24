// app/(auth)/signup/page.tsx
'use client';

import Link                                    from 'next/link';
import { useState }                            from 'react';
import { AnimatePresence, motion }             from 'framer-motion';
import { ArrowRight, Check, Eye, EyeOff, Phone } from 'lucide-react';
import { Button }                              from '@/components/ui/Button';
import { Reveal }                              from '@/components/ui/Reveal';  // named export
import { useSignup }                           from '@/modules/auth/hooks/useAuth';
import { signupSchema }                        from '@/modules/auth/schema';
import { ROUTES }                              from '@/config/routes';

// ─── Left-panel feature list ──────────────────────────────────────────────────

const FEATURES = [
  'Set up admissions, fees, and attendance in one workspace.',
  'Give staff a clean system that scales with your institute.',
  'Launch with reporting and operations from day one.',
];

// ─── Ambient glow (purely decorative) ────────────────────────────────────────

function BackgroundGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <motion.div
        className="absolute left-[8%] top-[4%] h-72 w-72 rounded-full bg-purple-600/[0.18] blur-3xl"
        animate={{ scale: [1, 1.05, 1], opacity: [0.18, 0.24, 0.18] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[10%] top-[18%] h-80 w-80 rounded-full bg-blue-500/[0.12] blur-3xl"
        animate={{ scale: [1.03, 1, 1.03], opacity: [0.14, 0.20, 0.14] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,#070709_100%)]" />
    </div>
  );
}

// ─── Form field types ─────────────────────────────────────────────────────────
// Must match signupSchema and authApi.signup exactly.
// Fields: name / email / phone / institute (no password — auth is OTP-based)

type FieldKey = 'name' | 'email' | 'phone' | 'institute';

interface FormState extends Record<FieldKey, string> {
  name:      string;
  email:     string;
  phone:     string;
  institute: string;
}

// ─── Single field component ───────────────────────────────────────────────────

// Static per-field config (no runtime values)
interface FieldConfig {
  id:           FieldKey;
  label:        string;
  type:         'text' | 'email' | 'tel';
  placeholder:  string;
  autoComplete: string;
}

// Full props passed to the Field component at render time
interface FieldProps extends FieldConfig {
  value:    string;
  error?:   string;
  onChange: (field: FieldKey, value: string) => void;
}

function Field({ id, label, type, value, placeholder, autoComplete, error, onChange }: FieldProps) {
  return (
    <div className="space-y-2.5">
      <label
        htmlFor={id}
        className="block text-[11px] font-medium uppercase tracking-[0.22em] text-white/38"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={e => onChange(id, e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          'w-full rounded-xl border bg-white/[0.04] px-4 py-3.5 text-sm text-white',
          'outline-none transition-all duration-200 placeholder:text-white/20',
          'focus:border-purple-400/65 focus:ring-4 focus:ring-purple-500/8',
          error
            ? 'border-red-500/35 focus:border-red-400/60 focus:ring-red-500/8'
            : 'border-white/[0.09]',
        ].join(' ')}
      />

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -4 }}
            className="text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Field config ─────────────────────────────────────────────────────────────

const FIELDS: FieldConfig[] = [
  { id: 'name',      label: 'Full name',      type: 'text',  placeholder: 'Rohit Sharma',        autoComplete: 'name' },
  { id: 'email',     label: 'Email',          type: 'email', placeholder: 'admin@growcad.in',    autoComplete: 'email' },
  { id: 'phone',     label: 'Mobile number',  type: 'tel',   placeholder: '+91 98765 43210',     autoComplete: 'tel' },
  { id: 'institute', label: 'Institute name', type: 'text',  placeholder: 'e.g. Apex Academy',   autoComplete: 'off' },
];

const INITIAL_FORM: FormState = { name: '', email: '', phone: '', institute: '' };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const [form,   setForm]   = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  // useSignup: handles token → cookie, tenant store, analytics, toast,
  // and redirect to /auth/otp?phone=<phone>
  const { signup, loading, error: apiError } = useSignup();

  const updateField = (field: FieldKey, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Client-side validation via the canonical Zod schema
    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const fe = result.error.flatten().fieldErrors;
      setErrors({
        name:      fe.name?.[0],
        email:     fe.email?.[0],
        phone:     fe.phone?.[0],
        institute: fe.institute?.[0],
      });
      return;
    }

    setErrors({});
    await signup(form); // all side-effects + redirect handled inside useSignup
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070709] text-white">
      <BackgroundGlow />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12 lg:px-10">
        <div className="grid w-full gap-14 lg:grid-cols-[minmax(0,1fr)_460px]">

          {/* ── LEFT: brand + feature list ── */}
          <Reveal variant="fadeUp" className="flex flex-col justify-center">
            <div className="max-w-[520px]">
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/68 transition-colors hover:border-white/16 hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 font-black text-white shadow-lg shadow-purple-500/20">
                  G
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Growcad
                </span>
              </Link>

              <div className="mt-10">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-purple-300/72">
                  New Workspace
                </p>
                <h1 className="mt-5 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-[3.4rem]">
                  Start your institute journey
                </h1>
                <p className="mt-6 max-w-[30rem] text-[15px] leading-7 text-white/46">
                  Create your Growcad workspace and bring admissions, fees, and
                  day-to-day operations into one calm system.
                </p>
              </div>

              <div className="mt-11 space-y-4">
                {FEATURES.map((feature, idx) => (
                  <Reveal key={feature} variant="fade" delay={0.06 * idx}>
                    <div className="flex items-start gap-3.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-purple-300/90">
                        <Check size={12} />
                      </span>
                      <p className="text-sm leading-6 text-white/56">{feature}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── RIGHT: signup form ── */}
          <Reveal variant="fadeUp" delay={0.12} className="flex items-center justify-center lg:justify-end">
            <motion.div
              whileHover={{ y: -1.5 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-[460px] rounded-[28px] border border-white/10 bg-white/[0.045] shadow-[0_32px_80px_rgba(0,0,0,0.52)] backdrop-blur-2xl"
            >
              {/* Top shimmer line */}
              <div className="h-px w-full rounded-t-[28px] bg-gradient-to-r from-transparent via-white/18 to-transparent" />

              <div className="px-6 py-7 sm:px-8 sm:py-9">
                <div className="mb-9">
                  <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                    Create account
                  </div>
                  <h2 className="text-[1.75rem] font-semibold tracking-[-0.02em] text-white">
                    Build your Growcad workspace
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/40">
                    Set up your account in under a minute. A verification code
                    will be sent to your mobile number.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {FIELDS.map(({ id, label, type, placeholder, autoComplete }) => (
                    <Field
                      key={id}
                      id={id}
                      label={label}
                      type={type}
                      value={form[id]}
                      placeholder={placeholder}
                      autoComplete={autoComplete}
                      error={errors[id]}
                      onChange={updateField}
                    />
                  ))}

                  {/* API-level error (email/phone already registered, network, etc.) */}
                  <AnimatePresence initial={false}>
                    {apiError && (
                      <motion.p
                        role="alert"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{    opacity: 0, y: -6 }}
                        className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm leading-6 text-red-300"
                      >
                        {apiError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4 pt-1">
                    <Button
                      type="submit"
                      loading={loading}
                      className="w-full justify-center py-3.5 text-sm shadow-[0_10px_24px_rgba(124,58,237,0.24)]"
                    >
                      {!loading && (
                        <>
                          Create Account
                          <ArrowRight size={15} className="ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-center text-xs leading-5 text-white/26">
                      By creating an account you agree to our{' '}
                      <span className="text-white/42">Terms &amp; Privacy Policy</span>.
                    </p>
                  </div>
                </form>

                <p className="mt-8 text-center text-sm text-white/40">
                  Already have an account?{' '}
                  <Link
                    href={ROUTES.login}
                    className="font-medium text-purple-300/90 transition-colors hover:text-purple-200"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.div>
          </Reveal>

        </div>
      </div>
    </div>
  );
}
