"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Message } from '@uigovpe/components';
import { api } from '@/services/api';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';

type AdminTab = 'overview' | 'users' | 'products' | 'reports';

interface OverviewActivity {
  id: number;
  method: string;
  route: string;
  timestamp: string;
  user?: {
    id?: number;
    name?: string;
    email?: string;
  } | null;
}

interface OverviewData {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalFavorites?: number;
  recentActivities?: OverviewActivity[];
}

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'STANDARD' | string;
  createdAt: string;
}

interface ProductItem {
  id: number;
  title: string;
  price: number;
  imageUrl?: string | null;
  categories?: { id: number; name: string }[];
  owner?: { name?: string } | null;
}

interface ReportItem {
  id: number;
  method: string;
  route: string;
  timestamp: string;
  user?: {
    id?: number;
    name?: string;
    email?: string;
  } | null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const [overview, setOverview] = useState<OverviewData>({
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalFavorites: 0,
    recentActivities: [],
  });
  const [users, setUsers] = useState<UserItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersSearch, setUsersSearch] = useState('');

  const [productsPage, setProductsPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);
  const [productsSearch, setProductsSearch] = useState('');

  const [reportsPage, setReportsPage] = useState(1);
  const [reportsTotalPages, setReportsTotalPages] = useState(1);
  const [reportsSearch, setReportsSearch] = useState('');
  const [reportsMethod, setReportsMethod] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STANDARD');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: unknown }).response === 'object' &&
      (error as { response?: { data?: unknown } }).response?.data &&
      typeof (error as { response?: { data?: { message?: unknown } } }).response?.data?.message === 'string'
    ) {
      return (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;
    }

    return fallback;
  };

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/overview');
      setOverview({
        totalUsers: response.data.totalUsers || 0,
        totalProducts: response.data.totalProducts || 0,
        totalCategories: response.data.totalCategories || 0,
        totalFavorites: response.data.totalFavorites || 0,
        recentActivities: response.data.recentActivities || [],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/users', {
        params: { page: usersPage, limit: 10, search: usersSearch || undefined },
      });
      setUsers(response.data.data);
      setUsersTotalPages(response.data.meta.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [usersPage, usersSearch]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/products', {
        params: { page: productsPage, limit: 10, search: productsSearch || undefined },
      });
      setProducts(response.data.data);
      setProductsTotalPages(response.data.meta.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [productsPage, productsSearch]);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/reports', {
        params: {
          page: reportsPage,
          limit: 10,
          search: reportsSearch || undefined,
          method: reportsMethod || undefined,
        },
      });
      setReports(response.data.data);
      setReportsTotalPages(response.data.meta.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [reportsMethod, reportsPage, reportsSearch]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (activeTab === 'overview') {
        void fetchOverview();
      }
      if (activeTab === 'users') {
        void fetchUsers();
      }
      if (activeTab === 'products') {
        void fetchProducts();
      }
      if (activeTab === 'reports') {
        void fetchReports();
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [activeTab, fetchOverview, fetchProducts, fetchReports, fetchUsers]);

  const handleUsersSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setUsersPage(1);
    void fetchUsers();
  };

  const handleProductsSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setProductsPage(1);
    void fetchProducts();
  };

  const handleReportsSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setReportsPage(1);
    void fetchReports();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    setModalLoading(true);

    try {
      await api.post('/users', { name, email, password, role });
      setModalSuccess('Usuario cadastrado com sucesso!');

      window.setTimeout(() => {
        setIsModalOpen(false);
        setModalSuccess('');
        setName('');
        setEmail('');
        setPassword('');
        setRole('STANDARD');
        void fetchUsers();
        if (activeTab === 'overview') {
          void fetchOverview();
        }
      }, 1200);
    } catch (error: unknown) {
      setModalError(getErrorMessage(error, 'Erro ao cadastrar usuario.'));
    } finally {
      setModalLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/admin/reports', {
        params: {
          page: 1,
          limit: 10000,
          search: reportsSearch || undefined,
          method: reportsMethod || undefined,
        },
      });

      const dataToExport: ReportItem[] = response.data.data;
      if (!dataToExport || dataToExport.length === 0) {
        return;
      }

      const headers = ['Log ID', 'Acao', 'Rota', 'Autor ID', 'Autor Nome', 'Autor Email', 'Data/Hora'];
      const csvRows = [headers.join(',')];

      for (const row of dataToExport) {
        const rowData = [
          row.id,
          row.method,
          row.route,
          row.user?.id || 'Sistema',
          row.user?.name || 'Sistema',
          row.user?.email || 'N/A',
          new Date(row.timestamp).toLocaleString('pt-BR'),
        ];

        const escapedRow = rowData.map((value) => `"${String(value).replace(/"/g, '""')}"`);
        csvRows.push(escapedRow.join(','));
      }

      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio_auditoria_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
    }
  };

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Visao Geral', icon: 'pi pi-chart-bar' },
    { id: 'users', label: 'Usuarios', icon: 'pi pi-users' },
    { id: 'products', label: 'Produtos', icon: 'pi pi-box' },
    { id: 'reports', label: 'Auditoria', icon: 'pi pi-shield' },
  ];

  const summaryCards = [
    { label: 'Usuarios ativos', value: overview.totalUsers, icon: 'pi pi-users', color: 'bg-blue-600' },
    { label: 'Produtos cadastrados', value: overview.totalProducts, icon: 'pi pi-box', color: 'bg-emerald-600' },
    { label: 'Categorias', value: overview.totalCategories, icon: 'pi pi-tags', color: 'bg-amber-600' },
    { label: 'Favoritados', value: overview.totalFavorites || 0, icon: 'pi pi-heart-fill', color: 'bg-rose-600' },
  ];

  const renderSectionHeader = (
    title: string,
    description: string,
    actions: React.ReactNode,
  ) => (
    <div className="flex flex-col gap-6 border-b border-slate-100 px-5 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="text-center lg:text-left">
        <h3 className="text-xl font-black text-gov-darkBlue sm:text-2xl">{title}</h3>
        <p className="mt-2 text-sm font-medium text-slate-500">{description}</p>
      </div>
      <div className="w-full lg:w-auto">{actions}</div>
    </div>
  );

  return (
    <div className="page-shell">
      <Header />

      <main className="main-content">
        <section className="page-hero rounded-[1.5rem] px-5 py-8 text-white sm:px-8 sm:py-10 md:px-10 md:py-12">
          <span className="eyebrow mb-4 flex w-fit items-center gap-2 border-white/20 bg-white/10 text-white">
            <i className="pi pi-briefcase"></i>
            Gestão Administrativa
          </span>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="max-w-3xl text-center lg:text-left">
              <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
                Painel Admin <span className="text-gov-yellow">Integrado</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                Controle usuários, produtos e auditoria em uma estrutura clara, centralizada e consistente.
              </p>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 lg:max-w-[26rem]">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Área Ativa</p>
                <p className="mt-1 truncate text-lg font-black sm:text-xl">
                  {tabs.find((tab) => tab.id === activeTab)?.label}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Ações</p>
                <p className="mt-1 truncate text-lg font-black sm:text-xl">Configurações</p>
              </div>
            </div>
          </div>
        </section>

        <section className="surface-card mx-auto mt-6 rounded-[1.5rem] p-2 sm:p-4">
          <nav className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide md:justify-center md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex h-11 shrink-0 items-center justify-center gap-2.5 rounded-xl px-5 text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gov-darkBlue text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-gov-blue'
                }`}
              >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </section>

        <section className="mt-6 w-full pb-10">
          {activeTab === 'overview' && (
            <div className="content-stack">
              <div className="grid-cards">
                {summaryCards.map((item) => (
                  <div key={item.label} className="panel-card group flex items-center justify-between gap-4 p-5 transition-all hover:border-gov-blue/20 sm:p-6">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                      <p className="mt-1 text-2xl font-black text-gov-darkBlue sm:text-3xl">{item.value}</p>
                    </div>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110 ${item.color}`}>
                      <i className={`${item.icon} text-xl`}></i>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
                <div className="panel-card overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
                    <h3 className="text-base font-black text-gov-darkBlue sm:text-lg">Atividade Recente</h3>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="text-[10px] font-black uppercase tracking-widest text-gov-blue hover:underline"
                    >
                      Ver Auditoria
                    </button>
                  </div>

                  <div>
                    {loading ? (
                      <div className="flex flex-col items-center justify-center px-5 py-20 text-slate-300">
                        <i className="pi pi-spin pi-spinner text-3xl mb-4"></i>
                        <p className="text-sm font-bold">Carregando dados...</p>
                      </div>
                    ) : !overview.recentActivities || overview.recentActivities.length === 0 ? (
                      <div className="px-5 py-16 text-center text-sm font-medium text-slate-400">
                        Nenhuma atividade registrada no momento.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50">
                        {overview.recentActivities.map((log) => (
                          <div key={log.id} className="group flex items-start gap-4 px-5 py-5 transition-colors hover:bg-slate-50/50 sm:px-6">
                            <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${
                              log.method === 'POST'
                                ? 'bg-emerald-50 text-emerald-600'
                                : log.method === 'DELETE'
                                  ? 'bg-rose-50 text-rose-600'
                                  : 'bg-amber-50 text-amber-600'
                            }`}>
                              <i className={`pi ${
                                log.method === 'POST'
                                  ? 'pi-plus'
                                  : log.method === 'DELETE'
                                    ? 'pi-trash'
                                    : 'pi-pencil'
                              } text-xs`}></i>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium leading-relaxed text-slate-600">
                                <span className="font-black text-gov-darkBlue">{log.user?.name || 'Sistema'}</span>{' '}
                                executou{' '}
                                <span className="inline-flex rounded-lg bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-500">
                                  {log.method}
                                </span>{' '}
                                em <code className="rounded bg-gov-blue/5 px-1.5 py-0.5 font-mono text-[11px] text-gov-blue">{log.route}</code>
                              </p>
                              <div className="mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <i className="pi pi-clock text-[9px]"></i>
                                {new Date(log.timestamp).toLocaleString('pt-BR')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="page-hero rounded-[1.5rem] p-6 text-white sm:p-8">
                  <h3 className="text-xl font-black">Ações Rápidas</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    Atalhos essenciais para manter a operação administrativa organizada.
                  </p>

                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-left backdrop-blur-md transition-all hover:bg-white/20"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-gov-darkBlue shadow-lg transition-transform group-hover:scale-110">
                        <i className="pi pi-user-plus text-lg"></i>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black">Criar Usuário</p>
                        <p className="truncate text-[10px] font-bold uppercase tracking-widest text-white/50">Novo acesso ao portal</p>
                      </div>
                    </button>

                    <button
                      onClick={() => router.push('/dashboard/categories/new')}
                      className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-left backdrop-blur-md transition-all hover:bg-white/20"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gov-yellow text-gov-darkBlue shadow-lg transition-transform group-hover:scale-110">
                        <i className="pi pi-tags text-lg"></i>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black">Criar Categoria</p>
                        <p className="truncate text-[10px] font-bold uppercase tracking-widest text-white/50">Organizar o catálogo</p>
                      </div>
                    </button>

                    <button
                      onClick={() => router.push('/dashboard/products/new')}
                      className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-left backdrop-blur-md transition-all hover:bg-white/20"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-gov-darkBlue shadow-lg transition-transform group-hover:scale-110">
                        <i className="pi pi-plus text-lg"></i>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black">Novo Produto</p>
                        <p className="truncate text-[10px] font-bold uppercase tracking-widest text-white/50">Cadastrar novo item</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="panel-card overflow-hidden">
              {renderSectionHeader(
                'Gestão de Usuários',
                'Administre perfis cadastrados e crie novos acessos.',
                <form onSubmit={handleUsersSearch} className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <i className="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                      type="text"
                      placeholder="Pesquisar usuário..."
                      value={usersSearch}
                      onChange={(e) => setUsersSearch(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50/50 pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-gov-blue/30 focus:ring-4 focus:ring-gov-blue/5"
                    />
                  </div>
                  <Button type="button" onClick={() => setIsModalOpen(true)} className="h-12 shrink-0 rounded-xl px-6 text-[11px] font-black uppercase tracking-widest">
                    <i className="pi pi-plus mr-2"></i>
                    Novo Usuário
                  </Button>
                </form>,
              )}

              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <i className="pi pi-spin pi-spinner text-3xl mb-4"></i>
                    <p className="text-sm font-bold">Buscando usuários...</p>
                  </div>
                ) : (
                  <>
                    <Table
                      data={users}
                      keyExtractor={(item) => item.id}
                      columns={[
                        { key: 'name', label: 'Nome', render: (row: UserItem) => <div className="text-sm font-black text-gov-darkBlue">{row.name}</div> },
                        { key: 'email', label: 'E-mail', render: (row: UserItem) => <div className="text-xs font-bold text-slate-500">{row.email}</div> },
                        {
                          key: 'role',
                          label: 'Perfil',
                          render: (row: UserItem) => (
                            <span className={`inline-flex rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                              row.role === 'ADMIN' ? 'bg-gov-darkBlue text-white shadow-sm' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {row.role === 'ADMIN' ? 'Admin' : 'Padrão'}
                            </span>
                          ),
                        },
                        {
                          key: 'createdAt',
                          label: 'Cadastro',
                          render: (row: UserItem) => <div className="text-[11px] font-bold text-slate-400">{new Date(row.createdAt).toLocaleDateString('pt-BR')}</div>,
                        },
                      ]}
                    />

                    <div className="mt-10 flex justify-center">
                      <Pagination currentPage={usersPage} totalPages={usersTotalPages} onPageChange={setUsersPage} />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="panel-card overflow-hidden">
              {renderSectionHeader(
                'Gestão de Produtos',
                'Acompanhe e gerencie todos os itens do catálogo.',
                <form onSubmit={handleProductsSearch} className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <i className="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                      type="text"
                      placeholder="Filtrar produtos..."
                      value={productsSearch}
                      onChange={(e) => setProductsSearch(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50/50 pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-gov-blue/30 focus:ring-4 focus:ring-gov-blue/5"
                    />
                  </div>
                  <Button type="button" onClick={() => router.push('/dashboard/products/new')} className="h-12 shrink-0 rounded-xl px-6 text-[11px] font-black uppercase tracking-widest">
                    <i className="pi pi-plus mr-2"></i>
                    Novo Item
                  </Button>
                </form>,
              )}

              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <i className="pi pi-spin pi-spinner text-3xl mb-4"></i>
                    <p className="text-sm font-bold">Buscando produtos...</p>
                  </div>
                ) : (
                  <>
                    <Table
                      data={products}
                      keyExtractor={(item) => item.id}
                      columns={[
                        { key: 'title', label: 'Item', render: (row: ProductItem) => <div className="line-clamp-1 text-sm font-black text-gov-darkBlue">{row.title}</div> },
                        {
                          key: 'price',
                          label: 'Preço',
                          render: (row: ProductItem) => (
                            <div className="text-xs font-black text-emerald-600">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.price)}
                            </div>
                          ),
                        },
                        {
                          key: 'categories',
                          label: 'Tags',
                          render: (row: ProductItem) => (
                            <div className="flex max-w-[200px] flex-wrap gap-1">
                              {row.categories && row.categories.length > 0 ? (
                                row.categories.slice(0, 2).map((category) => (
                                  <span key={category.id} className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-500">
                                    {category.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] italic text-slate-300">Sem tags</span>
                              )}
                            </div>
                          ),
                        },
                        {
                          key: 'owner',
                          label: 'Responsável',
                          render: (row: ProductItem) => <div className="text-[11px] font-bold text-slate-400">{row.owner?.name || 'Sistema'}</div>,
                        },
                      ]}
                    />

                    <div className="mt-10 flex justify-center">
                      <Pagination currentPage={productsPage} totalPages={productsTotalPages} onPageChange={setProductsPage} />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="panel-card overflow-hidden">
              {renderSectionHeader(
                'Auditoria do Sistema',
                'Consulte logs, filtre eventos e exporte relatórios.',
                <form onSubmit={handleReportsSearch} className="flex flex-col gap-3 lg:flex-row">
                  <div className="relative flex-1">
                    <i className="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                      type="text"
                      placeholder="Filtrar rota ou ação..."
                      value={reportsSearch}
                      onChange={(e) => setReportsSearch(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50/50 pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-gov-blue/30 focus:ring-4 focus:ring-gov-blue/5"
                    />
                  </div>
                  <div className="relative lg:w-48">
                    <select
                      value={reportsMethod}
                      onChange={(e) => {
                        setReportsMethod(e.target.value);
                        setReportsPage(1);
                      }}
                      className="h-12 w-full appearance-none rounded-xl border border-slate-100 bg-slate-50/50 px-4 text-[10px] font-black uppercase tracking-widest text-gov-darkBlue outline-none transition-all focus:border-gov-blue/30 focus:ring-4 focus:ring-gov-blue/5"
                    >
                      <option value="">Todos os Métodos</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                    <i className="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"></i>
                  </div>
                  <Button type="button" onClick={handleExportCSV} variant="outline" className="h-12 rounded-xl px-6 text-[11px] font-black uppercase tracking-widest">
                    <i className="pi pi-download mr-2"></i>
                    Exportar CSV
                  </Button>
                </form>,
              )}

              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <i className="pi pi-spin pi-spinner text-3xl mb-4"></i>
                    <p className="text-sm font-bold">Buscando auditoria...</p>
                  </div>
                ) : (
                  <>
                    <Table
                      data={reports}
                      keyExtractor={(item) => item.id}
                      columns={[
                        {
                          key: 'method',
                          label: 'Ação',
                          render: (row: ReportItem) => (
                            <span className={`inline-flex rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wider ${
                              row.method === 'POST'
                                ? 'bg-emerald-50 text-emerald-600'
                                : row.method === 'DELETE'
                                  ? 'bg-rose-50 text-rose-600'
                                  : 'bg-amber-50 text-amber-600'
                            }`}>
                              {row.method}
                            </span>
                          ),
                        },
                        {
                          key: 'route',
                          label: 'Recurso',
                          render: (row: ReportItem) => <code className="rounded-lg bg-gov-blue/5 px-2 py-1 text-[11px] font-mono font-bold text-gov-blue">{row.route}</code>,
                        },
                        {
                          key: 'user',
                          label: 'Autor',
                          render: (row: ReportItem) => (
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-gov-darkBlue">{row.user?.name || 'Sistema'}</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                                {row.user?.email || 'Interno'}
                              </span>
                            </div>
                          ),
                        },
                        {
                          key: 'timestamp',
                          label: 'Data/Hora',
                          render: (row: ReportItem) => (
                            <div className="text-[11px] font-bold text-slate-400">
                              {new Date(row.timestamp).toLocaleString('pt-BR')}
                            </div>
                          ),
                        },
                      ]}
                    />

                    <div className="mt-10 flex justify-center">
                      <Pagination currentPage={reportsPage} totalPages={reportsTotalPages} onPageChange={setReportsPage} />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gov-darkBlue/40 p-4 backdrop-blur-md sm:p-6">
          <div className="surface-card flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gov-blue">Administração</p>
                <h3 className="mt-1 text-2xl font-black tracking-tight text-gov-darkBlue">Novo Usuário</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500">
                <i className="pi pi-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div className="content-stack">
                {(modalError || modalSuccess) && (
                  <div className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-bold animate-in fade-in ${
                    modalError ? 'border-red-100 bg-red-50 text-red-600' : 'border-emerald-100 bg-emerald-50 text-emerald-600'
                  }`}>
                    <i className={`pi ${modalError ? 'pi-exclamation-circle' : 'pi-check-circle'} text-lg`}></i>
                    {modalError || modalSuccess}
                  </div>
                )}

                <div className="space-y-4">
                  <Input
                    label="Nome Completo"
                    type="text"
                    placeholder="Ex: João da Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    state={modalError ? 'error' : modalSuccess ? 'success' : 'default'}
                    className="!mb-0"
                  />

                  <Input
                    label="E-mail Corporativo"
                    type="email"
                    placeholder="nome@pe.gov.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    state={modalError ? 'error' : modalSuccess ? 'success' : 'default'}
                    className="!mb-0"
                  />

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gov-blue">Perfil de Acesso</label>
                    <div className="relative">
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="h-12 w-full appearance-none rounded-xl border border-slate-100 bg-slate-50/50 px-4 text-sm font-bold text-gov-darkBlue outline-none transition-all focus:border-gov-blue/30 focus:ring-4 focus:ring-gov-blue/5"
                      >
                        <option value="STANDARD">Usuário Padrão</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                      <i className="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"></i>
                    </div>
                  </div>

                  <Input
                    label="Senha Inicial"
                    type="password"
                    placeholder="Defina uma senha temporária"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    state={modalError ? 'error' : modalSuccess ? 'success' : 'default'}
                    className="!mb-0"
                  />
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[11px]">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={modalLoading} className="h-12 px-10 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-900/20">
                    {modalLoading ? (
                      <span className="flex items-center gap-2">
                        <i className="pi pi-spin pi-spinner"></i>
                        Cadastrando...
                      </span>
                    ) : 'Confirmar Cadastro'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
