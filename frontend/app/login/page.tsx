'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { apiFetch } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must have at least 6 characters'),
});

type LoginResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
  };
  token: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message ?? 'Invalid credentials.');
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
      });

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to login.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9ff] text-[#181c20] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[540px]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-[104px] h-[104px] rounded-xl bg-[#004085] text-white shadow-sm mb-5">
              <span className="material-symbols-outlined text-5xl">account_balance</span>
            </div>
            <h1 className="text-5xl font-extrabold text-[#002a5c] leading-tight">GovPE Management System</h1>
            <p className="text-3xl text-[#737782] mt-3">Institutional Department Portal</p>
          </div>

          <section className="bg-white border border-[#c3c6d2] rounded-lg p-8 shadow-sm">
            <h2 className="text-5xl font-bold text-[#181c20] border-b border-[#e0e3e8] pb-4">Acesso ao Sistema</h2>

            <form onSubmit={handleSubmit} className="space-y-6 mt-7">
              <div>
                <label htmlFor="email" className="block text-3xl font-semibold text-[#181c20] mb-2">
                  CPF / Usuario
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737782]">person</span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full h-14 rounded border border-[#c3c6d2] px-11 text-lg placeholder:text-[#c3c6d2] focus:outline-none focus:ring-2 focus:ring-[#abc7ff] focus:border-[#004085]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-3xl font-semibold text-[#181c20]">
                    Senha
                  </label>
                  <button
                    type="button"
                    className="text-[#0c458b] text-sm font-semibold hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737782]">lock</span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 rounded border border-[#c3c6d2] px-11 pr-12 text-lg placeholder:text-[#c3c6d2] focus:outline-none focus:ring-2 focus:ring-[#abc7ff] focus:border-[#004085]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((state) => !state)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737782]"
                  >
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                </div>
              </div>

              {errorMessage ? (
                <div className="rounded border border-[#ffdad6] bg-[#ffdad6] px-4 py-3 text-[#93000a] text-sm">
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-lg bg-[#004085] text-white text-2xl font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
                <span className="material-symbols-outlined">login</span>
              </button>

              <div className="pt-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px bg-[#c3c6d2] flex-1" />
                  <span className="text-[#737782] uppercase tracking-wider text-sm">ou acesse com</span>
                  <div className="h-px bg-[#c3c6d2] flex-1" />
                </div>
                <button
                  type="button"
                  className="w-full h-14 rounded-lg border border-[#c3c6d2] text-[#181c20] font-semibold text-xl hover:bg-[#f1f4f9] transition-colors"
                >
                  Acesso gov.br
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
