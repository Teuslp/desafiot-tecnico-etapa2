"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        role: 'STANDARD' 
      });
      
      setSuccess('Usuário cadastrado com sucesso!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Acesso negado: Apenas Administradores podem criar novos usuários.');
      } else {
        setError(err.response?.data?.message || 'Erro ao cadastrar usuário.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gov-gray px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow border border-gov-border">
        
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gov-darkBlue mb-2">Cadastrar</h1>
          <p className="text-sm text-gray-600">Crie um novo usuário no sistema.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
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
            placeholder="Digite o e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            state={error ? 'error' : success ? 'success' : 'default'}
          />

          <Input 
            label="Senha"
            type="password"
            placeholder="Crie uma senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            state={error ? 'error' : success ? 'success' : 'default'}
            helperText={error || success}
          />

          <div className="pt-4">
            <Button 
              type="submit" 
              fullWidth 
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já possui conta?{' '}
            <button 
              onClick={() => router.push('/login')}
              className="text-gov-blue hover:underline font-semibold"
            >
              Fazer login
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
