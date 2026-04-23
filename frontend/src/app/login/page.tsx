"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Message } from '@uigovpe/components';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error: unknown) => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: unknown }).response === 'object' &&
      (error as { response?: { data?: unknown } }).response?.data &&
      typeof (error as { response?: { data?: { message?: unknown } } }).response?.data?.message === 'string'
    ) {
      return (error as { response?: { data?: { message?: string } } }).response?.data?.message;
    }

    return 'E-mail ou senha inválidos.';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });

      const token = response.data.access_token;
      const role = response.data.user?.role || 'STANDARD';
      const name = response.data.user?.name || 'Usuario';

      Cookies.set('desafio.token', token, { expires: 1 });
      Cookies.set('desafio.role', role, { expires: 1 });
      Cookies.set('desafio.name', name, { expires: 1 });

      if (role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-5xl items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        {/* Left Side: Brand & Hero (Visible only on Desktop) */}
        <section className="page-hero hidden flex-col justify-between rounded-[2rem] p-10 text-white lg:flex">
          <div className="space-y-8">
            <span className="eyebrow flex w-fit items-center gap-2 border-white/20 bg-white/10 text-white">
              <i className="pi pi-shield"></i>
              Portal Institucional
            </span>
            <div className="space-y-6">
              <h1 className="text-5xl font-black leading-tight tracking-tight text-white">
                Gestão de Produtos com Identidade GovPE
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-white/80">
                Uma experiência mais clara, confiável e coerente com o ecossistema visual do Governo de Pernambuco.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: 'pi pi-box', title: 'Catálogo', text: 'Centralizado e organizado.' },
              { icon: 'pi pi-users', title: 'Acessos', text: 'Perfis administrativos.' },
              { icon: 'pi pi-chart-line', title: 'Auditoria', text: 'Logs de operação.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gov-darkBlue shadow-sm">
                  <i className={item.icon}></i>
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest">{item.title}</h2>
                <p className="mt-1.5 text-[11px] leading-relaxed text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="surface-card relative flex flex-col justify-center overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:shadow-none">
          <div className="absolute top-0 h-1.5 w-full bg-gradient-to-r from-gov-darkBlue via-gov-blue to-gov-yellow"></div>
          
          <div className="flex flex-col p-8 sm:p-12 lg:p-16">
            <div className="mb-10 text-center lg:text-left">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gov-blue/10 text-gov-blue lg:hidden">
                <i className="pi pi-box text-2xl"></i>
              </div>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gov-blue sm:text-[0.7rem]">
                GovProdutos Pernambuco
              </p>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-gov-darkBlue sm:text-5xl">Entrar</h2>
              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500">
                Acesse o portal com suas credenciais para gerenciar o catálogo institucional.
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600 animate-in fade-in">
                  <i className="pi pi-exclamation-circle text-lg"></i>
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <Input
                  label="E-mail Institucional"
                  type="email"
                  placeholder="nome@pe.gov.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  state={error ? 'error' : 'default'}
                  icon="pi pi-envelope"
                  className="!mb-0"
                />
              </div>

              <div className="space-y-1">
                <Input
                  label="Senha de Acesso"
                  type="password"
                  placeholder="Informe sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  state={error ? 'error' : 'default'}
                  icon="pi pi-lock"
                  className="!mb-0"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-14 w-full rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/15 sm:text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <i className="pi pi-spin pi-spinner"></i>
                    Autenticando
                  </span>
                ) : 'Acessar Portal'}
              </Button>

              <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl bg-slate-50/80 p-5 text-center sm:flex-row sm:text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                  <i className="pi pi-info"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ambiente Seguro</p>
                  <p className="mt-0.5 text-xs font-medium leading-relaxed text-slate-500">
                    Acesso restrito a usuários autorizados do ecossistema GovPE.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
