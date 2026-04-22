import React from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function Header() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('desafio.token');
    router.push('/login');
  };

  return (
    <header className="w-full bg-white border-b border-gov-border px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Esquerda: Logo / Assinatura */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-bold border border-gray-300">
          LOGO
        </div>
        <div>
          <h1 className="text-xl font-bold text-gov-darkBlue leading-tight">Painel de Produtos</h1>
          <p className="text-sm text-gray-500">Sistema Institucional</p>
        </div>
      </div>

      {/* Centro: Barra de busca (opcional, visual) */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
        <input 
          type="text" 
          placeholder="O que você procura?" 
          className="w-full bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gov-blue placeholder-italic"
        />
        <div className="absolute right-3 top-2.5 text-gov-blue font-bold">
          ⌕
        </div>
      </div>

      {/* Direita: Ações do Usuário */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/dashboard/products/new')}
          className="text-sm font-semibold text-gov-blue hover:underline"
        >
          + Novo Produto
        </button>

        <div className="h-6 border-l border-gray-300 mx-2"></div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-semibold text-gov-darkBlue hover:text-gov-red transition-colors"
        >
          <span>👤</span> Sair
        </button>
      </div>
    </header>
  );
}
