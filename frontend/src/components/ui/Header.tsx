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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-white border-b-2 border-gov-blue sticky top-0 z-50 shadow-sm relative">
      <div className="max-w-7xl mx-auto w-full px-4 py-2 flex items-center justify-between">
        
        {/* LADO ESQUERDO: LOGO */}
        <div
          onClick={goHome}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 bg-gov-darkBlue rounded-md flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <div>
            <h1 className="text-lg font-black text-gov-darkBlue tracking-tight leading-none m-0">GovProdutos</h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold m-0">Sistema Institucional</p>
          </div>
        </div>

        {/* BOTÃO HAMBÚRGUER MOBILE */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gov-darkBlue hover:bg-gray-100 rounded focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen 
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>

        {/* LADO DIREITO: NAVEGAÇÃO E AÇÕES */}
        <nav className={`
          ${isMobileMenuOpen ? 'flex absolute top-full left-0 w-full bg-white border-b-2 border-gov-blue px-4 py-4 flex-col gap-3 shadow-lg z-50' : 'hidden'}
          md:flex md:static md:w-auto md:bg-transparent md:border-none md:p-0 md:shadow-none md:flex-row md:items-center md:gap-1.5
        `}>

          {/* Link para o Catálogo (Vitrine) */}
          <button
            onClick={() => handleNavClick('/dashboard')}
            className="flex items-center gap-2 md:gap-1 px-4 py-3 md:px-2.5 md:py-1.5 text-sm md:text-xs font-bold text-gov-darkBlue hover:bg-blue-50 rounded transition-colors w-full md:w-auto justify-start md:justify-center"
          >
            <svg className="w-4 h-4 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Catálogo
          </button>

          {/* Links Específicos ADMIN */}
          {role === 'ADMIN' && (
            <button
              onClick={() => handleNavClick('/dashboard/admin')}
              className="flex items-center gap-2 md:gap-1 px-4 py-3 md:px-2.5 md:py-1.5 text-sm md:text-xs font-bold text-gov-darkBlue hover:bg-blue-50 rounded transition-colors w-full md:w-auto justify-start md:justify-center"
            >
              <svg className="w-4 h-4 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Administração
            </button>
          )}

          {/* Links Específicos USUÁRIO PADRÃO */}
          {role === 'STANDARD' && (
            <>
              <button
                onClick={() => handleNavClick('/dashboard/favorites')}
                className="flex items-center gap-2 md:gap-1 px-4 py-3 md:px-2.5 md:py-1.5 text-sm md:text-xs font-bold text-gov-darkBlue hover:bg-blue-50 rounded transition-colors w-full md:w-auto justify-start md:justify-center"
              >
                <svg className="w-4 h-4 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                Favoritos
              </button>
              <button
                onClick={() => handleNavClick('/dashboard/categories/new')}
                className="flex items-center gap-2 md:gap-1 px-4 py-3 md:px-2.5 md:py-1.5 text-sm md:text-xs font-bold text-gov-darkBlue hover:bg-blue-50 rounded transition-colors w-full md:w-auto justify-start md:justify-center"
              >
                <svg className="w-4 h-4 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Categorias
              </button>
              <button
                onClick={() => handleNavClick('/dashboard/products/new')}
                className="flex items-center gap-2 md:gap-1 px-4 py-3 md:px-3 md:py-1.5 text-sm md:text-xs font-bold bg-gov-darkBlue text-white hover:bg-gov-blue rounded transition-colors w-full md:w-auto justify-start md:justify-center"
              >
                <svg className="w-4 h-4 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Novo Produto
              </button>
            </>
          )}

          <div className="hidden md:block h-4 border-l-2 border-gray-200 mx-1"></div>
          {isMobileMenuOpen && <div className="md:hidden h-px bg-gray-200 my-1 w-full"></div>}

          {/* SINO DE NOTIFICAÇÕES */}
          <div className="relative flex items-center w-full md:w-auto justify-start md:justify-center">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center gap-2 md:gap-0 px-4 py-3 md:p-1.5 text-sm md:text-xs font-bold text-gov-darkBlue hover:bg-blue-50 transition-colors rounded md:rounded-full w-full md:w-auto justify-start md:justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="md:hidden">Notificações</span>
              {notifications.length > 0 && (
                <span className="md:absolute top-0.5 right-0.5 ml-2 md:ml-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 md:right-0 left-0 md:left-auto top-full md:top-10 mt-1 md:mt-2 w-full md:w-72 bg-white border border-gray-200 shadow-xl rounded z-50 overflow-hidden">
                <div className="bg-white px-3 py-2 border-b border-gray-200">
                  <h4 className="text-[10px] font-bold text-gray-600 uppercase m-0">Suas Notificações</h4>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-500 px-3 py-4 text-center m-0">Nenhuma notificação nova.</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-3 hover:bg-blue-50 border-b border-gray-100 last:border-0 cursor-pointer transition flex flex-col group" onClick={() => markAsRead(n.id)}>
                        <p className="text-gray-700 text-xs leading-snug m-0">{n.message}</p>
                        <span className="text-[10px] text-gov-blue font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">✔ Marcar como lida</span>
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
            className="flex items-center gap-2 md:gap-1 px-4 py-3 md:px-2.5 md:py-1.5 text-sm md:text-xs font-bold text-red-600 hover:bg-red-50 rounded transition-colors w-full md:w-auto justify-start md:justify-center"
          >
            <svg className="w-4 h-4 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sair
          </button>

        </nav>
      </div>
    </header>
  );
}
