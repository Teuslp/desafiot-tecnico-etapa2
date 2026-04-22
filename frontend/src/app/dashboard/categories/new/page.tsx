"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar categoria.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gov-gray flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gov-darkBlue mb-1">Nova Categoria</h2>
            <p className="text-gray-600 text-sm">Crie uma nova tag para organizar os produtos.</p>
          </div>
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            Voltar
          </Button>
        </div>

        <form onSubmit={handleCreateCategory} className="bg-white border border-gov-border rounded p-6 shadow-sm space-y-4">
          <Input 
            label="Nome da Categoria"
            type="text"
            placeholder="Ex: Eletrônicos, Mobiliário..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            state={error ? 'error' : success ? 'success' : 'default'}
            helperText={error || success}
          />

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Categoria'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
