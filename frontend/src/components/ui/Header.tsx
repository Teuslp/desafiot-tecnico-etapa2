"use client";

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Avatar, Badge } from '@uigovpe/components';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';

interface Notification {
  id: number;
  message: string;
}

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: string[];
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [role] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return Cookies.get('desafio.role') || 'STANDARD';
  });
  const [name] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return Cookies.get('desafio.name') || 'Usuario';
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = Cookies.get('desafio.token');
    if (token) {
      api.get('/notifications')
        .then((res) => setNotifications(res.data))
        .catch(console.error);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    ['desafio.token', 'desafio.role', 'desafio.name'].forEach((cookie) => Cookies.remove(cookie));
    setIsMobileMenuOpen(false);
    router.push('/login');
  };

  const navigateTo = (path: string) => {
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;

  const navItems: NavItem[] = [
    { label: 'Catalogo', path: '/dashboard', icon: 'pi pi-th-large', roles: ['ADMIN', 'STANDARD'] },
    { label: 'Painel Admin', path: '/dashboard/admin', icon: 'pi pi-cog', roles: ['ADMIN'] },
    { label: 'Favoritos', path: '/dashboard/favorites', icon: 'pi pi-heart', roles: ['STANDARD'] },
    { label: 'Categorias', path: '/dashboard/categories/new', icon: 'pi pi-tags', roles: ['STANDARD'] },
  ];

  const visibleNavItems = navItems.filter((item) => item.roles.includes(role || ''));
  const showNewProductButton = role === 'STANDARD';

  const renderNavButton = (item: NavItem, compact = false) => (
    <button
      key={item.path}
      onClick={() => navigateTo(item.path)}
      className={`flex items-center justify-center gap-2 rounded-xl border transition ${
        compact
          ? 'min-h-11 px-3 py-2 text-xs sm:text-sm'
          : 'h-11 px-4 text-sm'
      } ${
        isActive(item.path)
          ? 'border-gov-blue/15 bg-gov-darkBlue text-white shadow-md shadow-blue-950/10'
          : 'border-slate-200 bg-white text-slate-500 hover:border-gov-blue/20 hover:text-gov-darkBlue'
      }`}
    >
      <i className={item.icon}></i>
      <span className="truncate font-bold">{item.label}</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="h-1 w-full bg-gradient-to-r from-gov-darkBlue via-gov-blue to-gov-yellow"></div>

      <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-3 px-4 py-3 sm:px-5 lg:px-6">
        <div className="grid items-center gap-3 lg:grid-cols-[minmax(220px,1fr)_auto_minmax(260px,1fr)]">
          <div className="flex items-center justify-between gap-3 lg:contents">
            <button
              onClick={() => navigateTo(role === 'ADMIN' ? '/dashboard/admin' : '/dashboard')}
              className="flex min-w-0 items-center gap-3 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gov-darkBlue text-white shadow-md shadow-blue-950/15">
                <i className="pi pi-building-columns text-base"></i>
              </div>
              <div className="min-w-0">
                <p className="truncate text-[0.62rem] font-black uppercase tracking-[0.2em] text-gov-blue sm:text-[0.68rem]">
                  Governo de Pernambuco
                </p>
                <h1 className="truncate text-sm font-black text-gov-darkBlue sm:text-base">Portal de Produtos</h1>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              className="surface-subtle flex h-10 w-10 items-center justify-center rounded-xl text-gov-darkBlue lg:hidden"
              title="Abrir menu"
            >
              <i className={`pi ${isMobileMenuOpen ? 'pi-times' : 'pi-bars'} text-sm`}></i>
            </button>
          </div>

          <nav className="hidden items-center justify-center gap-2 lg:flex">
            {visibleNavItems.map((item) => renderNavButton(item))}
          </nav>

          <div className="hidden items-center justify-end gap-2 sm:gap-3 lg:flex">
            {showNewProductButton && (
              <Button
                type="button"
                onClick={() => navigateTo('/dashboard/products/new')}
                className="hidden h-10 rounded-xl px-4 text-[11px] font-black uppercase tracking-[0.16em] lg:flex"
              >
                <span className="flex items-center gap-2">
                  <i className="pi pi-plus-circle"></i>
                  Novo produto
                </span>
              </Button>
            )}

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="surface-subtle relative flex h-10 w-10 items-center justify-center rounded-xl text-gov-darkBlue transition hover:border-gov-blue/20 hover:text-gov-blue"
                title="Notificacoes"
              >
                <i className="pi pi-bell text-sm"></i>
                {notifications.length > 0 && (
                  <span className="absolute -right-1 -top-1">
                    <Badge value={notifications.length > 9 ? '9+' : String(notifications.length)} severity="danger" />
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="surface-card absolute right-0 mt-3 w-[20rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[0.9rem]">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-gov-blue">Notificacoes</p>
                    <h2 className="mt-1 text-sm font-bold text-gov-darkBlue">Atualizacoes recentes do sistema</h2>
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-5 text-sm text-slate-500">Nenhum aviso no momento.</p>
                    ) : (
                      notifications.map((notification) => (
                        <div key={notification.id} className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600 last:border-b-0">
                          {notification.message}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden text-right md:block">
              <p className="max-w-[11rem] truncate text-sm font-black text-gov-darkBlue">{name}</p>
              <p className="text-[0.62rem] font-black uppercase tracking-[0.15em] text-slate-400">
                {role === 'ADMIN' ? 'Administrador' : 'Usuario padrao'}
              </p>
            </div>

            <Avatar
              image={`https://ui-avatars.com/api/?name=${name}&background=0c326f&color=fff`}
              className="h-10 w-10 rounded-xl border border-slate-100"
            />

            <button
              onClick={handleLogout}
              className="surface-subtle flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:border-red-200 hover:text-red-500"
              title="Sair"
            >
              <i className="pi pi-power-off text-sm"></i>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="surface-card rounded-[1rem] p-3 lg:hidden">
            <div className="mb-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
              <Avatar
                image={`https://ui-avatars.com/api/?name=${name}&background=0c326f&color=fff`}
                className="h-10 w-10 rounded-xl border border-slate-100"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-gov-darkBlue">{name}</p>
                <p className="text-[0.68rem] font-black uppercase tracking-[0.15em] text-slate-400">
                  {role === 'ADMIN' ? 'Administrador' : 'Usuario padrao'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {visibleNavItems.map((item) => renderNavButton(item, true))}
            </div>

            <div className="mt-3 grid gap-2">
              {showNewProductButton && (
                <Button
                  type="button"
                  onClick={() => navigateTo('/dashboard/products/new')}
                  className="h-11 w-full rounded-xl text-[11px] font-black uppercase tracking-[0.16em]"
                >
                  <span className="flex items-center justify-center gap-2">
                    <i className="pi pi-plus-circle"></i>
                    Novo produto
                  </span>
                </Button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="surface-subtle flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-4 text-[11px] font-black uppercase tracking-[0.16em] text-red-500"
              >
                <i className="pi pi-power-off"></i>
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
