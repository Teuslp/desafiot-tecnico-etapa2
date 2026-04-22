"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      const token = response.data.access_token;
      const role = response.data.user?.role || 'STANDARD'; // fallback caso não venha
      
      Cookies.set('desafio.token', token, { expires: 1 });
      Cookies.set('desafio.role', role, { expires: 1 });
      
      if (role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gov-gray px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow border border-gov-border">
        
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gov-darkBlue mb-2">Entrar</h1>
          <p className="text-sm text-gray-600">Acesse com sua conta institucional.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            state={error ? 'error' : 'default'}
          />

          <Input 
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            state={error ? 'error' : 'default'}
            helperText={error}
          />

          <div className="pt-4">
            <Button 
              type="submit" 
              fullWidth 
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
