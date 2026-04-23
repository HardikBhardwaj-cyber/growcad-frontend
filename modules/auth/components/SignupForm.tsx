// modules/auth/components/SignupForm.tsx
'use client';

import { useState }                          from 'react';
import { motion }                            from 'framer-motion';
import { Mail, Phone, User, School, ArrowRight, type LucideIcon } from 'lucide-react';
import Link                                  from 'next/link';
import { Input }                             from '@/components/ui/Input';
import { Button }                            from '@/components/ui/Button';
import { Card }                              from '@/components/ui/card';   // ← capital C
import { fadeUp }                            from '@/lib/motion';
import { ROUTES }                            from '@/config/routes';
import { signupSchema }                      from '../schema';
import { useSignup }                         from '../hooks/useAuth';        // ← hook, not raw authApi
import { AuthLogo }                          from './LoginForm';

// ─── Field config ─────────────────────────────────────────────────────────────

type FieldKey = 'name' | 'email' | 'phone' | 'institute';

const FIELDS: {
  key:         FieldKey;
  label:       string;
  placeholder: string;
  type?:       string;
  Icon:        LucideIcon;
}[] = [
  { key: 'name',      label: 'Your name',      placeholder: 'Rahul Kumar',        Icon: User   },
  { key: 'email',     label: 'Work email',     placeholder: 'you@institute.com',  Icon: Mail,  type: 'email' },
  { key: 'phone',     label: 'Mobile number',  placeholder: '+91 98765 43210',    Icon: Phone, type: 'tel'   },
  { key: 'institute', label: 'Institute name', placeholder: 'e.g. Apex Academy',  Icon: School },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function SignupForm() {
  const [form,   setForm]   = useState({ name: '', email: '', phone: '', institute: '' });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  // useSignup handles: token, tenant store, analytics, toast, and redirect
  // to /auth/otp?phone=<phone> — no manual wiring needed here.
  const { signup, loading, error: apiError } = useSignup();

  const set = (k: FieldKey) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation first — avoids a round-trip for obvious errors
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
    await signup(form); // useSignup handles all side-effects + redirect
  };

  return (
    <motion.div
      className="w-full max-w-[420px]"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <AuthLogo />

      <Card className="p-8">
        <h1 className="text-[22px] font-bold tracking-[-0.03em] text-white">
          Create your account
        </h1>
        <p className="mt-[6px] text-[13.5px] text-white/42">
          Free forever on Starter · No card needed
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
          {FIELDS.map(({ key, label, placeholder, type, Icon }) => (
            <Input
              key={key}
              label={label}
              type={type ?? 'text'}
              autoComplete={
                key === 'email' ? 'email'
                : key === 'phone' ? 'tel'
                : undefined
              }
              value={form[key]}
              onChange={set(key)}
              placeholder={placeholder}
              icon={<Icon size={14} />}
              error={errors[key]}
            />
          ))}

          {/* apiError comes from useSignup — server messages (duplicate email, etc.) */}
          {apiError && (
            <p className="text-[12.5px] text-rose-400" role="alert">
              {apiError}
            </p>
          )}

          <Button type="submit" loading={loading} fullWidth className="mt-1">
            Get started free <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </form>

        <p className="mt-6 text-center text-[12px] text-white/28">
          Already have an account?{' '}
          <Link
            href={ROUTES.login}
            className="text-violet-400 transition-colors hover:text-violet-300"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </motion.div>
  );
}
