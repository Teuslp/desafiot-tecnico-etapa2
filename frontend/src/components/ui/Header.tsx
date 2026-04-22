"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '@/services/api';

export function Header() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setRole(Cookies.get('desafio.role') || 'STANDARD');
    
    const token = Cookies.get('desafio.token');
    if (token) {
      api.get('/notifications')
        .then(res => setNotifications(res.data))
        .catch(console.error);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('desafio.token');
    Cookies.remove('desafio.role');
    router.push('/login');
  };

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) { console.error(e); }
  };

  const goHome = () => {
    router.push(role === 'ADMIN' ? '/dashboard/admin' : '/dashboard');
  };

  return (
    <header className="w-full bg-white border-b-2 border-gov-blue px-6 py-3 flex flex-col md:flex-row items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* LADO ESQUERDO: LOGO */}
      <div 
        onClick={goHome} 
        className="flex items-center gap-2 cursor-pointer mb-4 md:mb-0"
      >
        <div className="w-8 h-8 bg-gov-darkBlue rounded-md flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
        </div>
        <div>
          <h1 className="text-xl font-black text-gov-darkBlue tracking-tight leading-none">GovProdutos</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Sistema Institucional</p>
        </div>
      </div>

      {/* LADO DIREITO: NAVEGAÇÃO E AÇÕES */}
      <nav className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
        
        {/* Links Universais */}
        <button 
          onClick={goHome} 
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-gov-darkBlue hover:bg-blue-50 rounded-md transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Início
        </button>

        {/* Links Específicos ADMIN */}
        {role === 'ADMIN' && (
          <button 
            onClick={() => router.push('/dashboard/admin')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-gov-darkBlue hover:bg-blue-50 rounded-md transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Administração
          </button>
        )}

        {/* Links Específicos USUÁRIO PADRÃO */}
        {role === 'STANDARD' && (
          <>
            <button 
              onClick={() => router.push('/dashboard/favorites')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-gov-darkBlue hover:bg-blue-50 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              Favoritos
            </button>
            <button 
              onClick={() => router.push('/dashboard/categories/new')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-gov-darkBlue hover:bg-blue-50 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Categorias
            </button>
            <button 
              onClick={() => router.push('/dashboard/products/new')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-gov-darkBlue text-white hover:bg-gov-blue rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Novo Produto
            </button>
          </>
        )}

        <div className="hidden md:block h-6 border-l-2 border-gray-200 mx-2"></div>

        {/* SINO DE NOTIFICAÇÕES */}
        <div className="relative flex items-center">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gov-darkBlue hover:bg-blue-50 transition-colors rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 mt-2 w-80 bg-white border border-gray-200 shadow-2xl rounded-lg z-50 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="text-xs font-bold text-gray-600 uppercase">Suas Notificações</h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 px-4 py-6 text-center">Nenhuma notificação nova.</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-4 hover:bg-blue-50 border-b border-gray-100 last:border-0 cursor-pointer transition flex flex-col group" onClick={() => markAsRead(n.id)}>
                      <p className="text-gray-700 text-sm leading-snug">{n.message}</p>
                      <span className="text-xs text-gov-blue font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">✔ Marcar como lida</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Sair
        </button>

      </nav>
    </header>
  );
}
