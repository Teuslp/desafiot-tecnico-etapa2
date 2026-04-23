"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Message } from '@uigovpe/components';
import { api } from '@/services/api';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

    return 'Erro ao criar categoria.';
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/categories', { name });
      setSuccess('Categoria criada com sucesso!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Header />

      <main className="main-content">
        <section className="page-hero rounded-[1rem] px-4 py-6 text-white sm:px-5 sm:py-7 md:px-7 md:py-8">
          <span className="eyebrow text-white">
            <i className="pi pi-tags"></i>
            Organizacao do catalogo
          </span>
          <div className="mt-5 max-w-3xl text-center lg:text-left">
            <h1 className="section-title text-white">Criar categoria com linguagem institucional</h1>
            <p className="section-subtitle mt-4">
              Adicione novas classificacoes para manter o catalogo claro, escalavel e alinhado ao padrao GovPE.
            </p>
          </div>
        </section>

        <div className="mx-auto mt-5 grid max-w-[1040px] gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <form
            onSubmit={handleCreateCategory}
            className="surface-card rounded-[1rem] p-5 sm:p-6 md:p-8"
          >
            <div className="content-stack">
              {(error || success) && (
                <Message severity={error ? 'error' : 'success'} text={error || success} />
              )}

              <div className="field-shell">
                <Input
                  label="Nome da categoria"
                  type="text"
                  placeholder="Ex: Eletronicos, mobiliario, escritorio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  state={error ? 'error' : success ? 'success' : 'default'}
                  className="mb-0"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="h-11 w-full rounded-xl text-[11px] font-black uppercase tracking-[0.16em] sm:h-12"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl text-[11px] font-black uppercase tracking-[0.16em] shadow-xl shadow-blue-900/10 sm:h-12"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <i className="pi pi-spin pi-spinner"></i>
                      Salvando
                    </span>
                  ) : 'Criar categoria'}
                </Button>
              </div>
            </div>
          </form>

          <aside className="content-stack">
            <div className="panel-card p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gov-blue/10 text-gov-blue">
                <i className="pi pi-info-circle text-lg"></i>
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.14em] text-gov-darkBlue">Boas praticas</h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Prefira nomes objetivos e amplos, que ajudem na filtragem e reduzam duplicidade no cadastro.
              </p>
            </div>

            <div className="panel-card p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gov-yellow/15 text-gov-darkBlue">
                <i className="pi pi-check-circle text-lg"></i>
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.14em] text-gov-darkBlue">Impacto no sistema</h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Categorias bem definidas melhoram a navegacao do catalogo, os filtros e a leitura operacional do time.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
