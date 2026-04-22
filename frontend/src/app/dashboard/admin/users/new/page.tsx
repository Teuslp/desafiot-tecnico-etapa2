"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminNewUserPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STANDARD');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/users', { 
        name, 
        email, 
        password,
        role
      });
      
      setSuccess('Usuário cadastrado com sucesso!');
      setTimeout(() => {
        router.push('/dashboard/admin');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar usuário.');
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
            <h2 className="text-2xl font-bold text-gov-darkBlue mb-1">Cadastrar Novo Usuário</h2>
            <p className="text-gray-600 text-sm">Acesso restrito a Administradores.</p>
          </div>
          <Button variant="ghost" onClick={() => router.push('/dashboard/admin')}>
            Voltar
          </Button>
        </div>

        <form onSubmit={handleRegister} className="bg-white border border-gov-border rounded p-6 shadow-sm space-y-4">
          <Input 
            label="Nome Completo"
            type="text"
            placeholder="Digite o nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            state={error ? 'error' : success ? 'success' : 'default'}
          />

          <Input 
            label="E-mail"
            type="email"
            placeholder="Digite o e-mail corporativo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            state={error ? 'error' : success ? 'success' : 'default'}
          />

          <div className="flex flex-col mb-4">
            <label className="mb-1 text-sm font-semibold text-gov-text">Perfil de Acesso</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gov-border rounded bg-white transition-colors focus:border-gov-blue focus:ring-1 focus:ring-gov-blue outline-none h-[42px]"
            >
              <option value="STANDARD">Usuário Padrão (Visualiza e Favorita Produtos)</option>
              <option value="ADMIN">Administrador (Acesso Total ao Painel)</option>
            </select>
          </div>

          <Input 
            label="Senha Inicial"
            type="password"
            placeholder="Crie uma senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            state={error ? 'error' : success ? 'success' : 'default'}
            helperText={error || success}
          />

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard/admin')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Salvar Usuário'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
