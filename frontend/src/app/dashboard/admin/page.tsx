"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports'>('overview');

  // Dados
  const [overview, setOverview] = useState({ totalUsers: 0, totalProducts: 0, totalCategories: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros Usuários
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersSearch, setUsersSearch] = useState('');

  // Filtros Relatórios
  const [reportsPage, setReportsPage] = useState(1);
  const [reportsTotalPages, setReportsTotalPages] = useState(1);
  const [reportsSearch, setReportsSearch] = useState('');
  const [reportsMethod, setReportsMethod] = useState('');

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STANDARD');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const fetchOverview = async () => {
    try {
      const res = await api.get('/admin/overview');
      setOverview(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', {
        params: { page: usersPage, limit: 10, search: usersSearch || undefined }
      });
      setUsers(res.data.data);
      setUsersTotalPages(res.data.meta.totalPages);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports', {
        params: { page: reportsPage, limit: 10, search: reportsSearch || undefined, method: reportsMethod || undefined }
      });
      setReports(res.data.data);
      setReportsTotalPages(res.data.meta.totalPages);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'overview') fetchOverview();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'reports') fetchReports();
  }, [activeTab, usersPage, reportsPage, reportsMethod]);

  const handleUsersSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setUsersPage(1);
    fetchUsers();
  };

  const handleReportsSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setReportsPage(1);
    fetchReports();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    setModalLoading(true);

    try {
      await api.post('/users', { name, email, password, role });
      setModalSuccess('Usuário cadastrado com sucesso!');
      setTimeout(() => {
        setIsModalOpen(false);
        setModalSuccess('');
        setName(''); setEmail(''); setPassword(''); setRole('STANDARD');
        fetchUsers();
        if (activeTab === 'overview') fetchOverview();
      }, 1500);
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Erro ao cadastrar usuário.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gov-gray flex flex-col relative">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gov-darkBlue mb-2">Painel de Administração</h2>
            <p className="text-gray-600">Visão global e gerenciamento do sistema.</p>
          </div>
        </div>

        <div className="flex border-b border-gray-300 mb-6">
          <button
            className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === 'overview' ? 'border-b-4 border-gov-blue text-gov-blue' : 'text-gray-500 hover:text-gov-blue'}`}
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </button>
          <button
            className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === 'users' ? 'border-b-4 border-gov-blue text-gov-blue' : 'text-gray-500 hover:text-gov-blue'}`}
            onClick={() => setActiveTab('users')}
          >
            Gestão de Usuários
          </button>
          <button
            className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === 'reports' ? 'border-b-4 border-gov-blue text-gov-blue' : 'text-gray-500 hover:text-gov-blue'}`}
            onClick={() => setActiveTab('reports')}
          >
            Relatórios de Auditoria
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* CARDS GOVBR-DS STYLE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="bg-white p-6 border-t-4 border-gov-blue rounded shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Usuários</p>
                  <h3 className="text-3xl font-black text-gov-darkBlue mt-1">{overview.totalUsers || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-gov-blue text-white flex items-center justify-center rounded-full shadow-inner">
                  <i className="fas fa-users text-xl"></i>
                </div>
              </div>

              <div className="bg-white p-6 border-t-4 border-gov-blue rounded shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Produtos</p>
                  <h3 className="text-3xl font-black text-gov-darkBlue mt-1">{overview.totalProducts || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-gov-blue text-white flex items-center justify-center rounded-full shadow-inner">
                  <i className="fas fa-box-open text-xl"></i>
                </div>
              </div>

              <div className="bg-white p-6 border-t-4 border-gov-blue rounded shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Categorias</p>
                  <h3 className="text-3xl font-black text-gov-darkBlue mt-1">{overview.totalCategories || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-gov-blue text-white flex items-center justify-center rounded-full shadow-inner">
                  <i className="fas fa-tags text-xl"></i>
                </div>
              </div>

              <div className="bg-white p-6 border-t-4 border-gov-blue rounded shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Favoritados</p>
                  <h3 className="text-3xl font-black text-gov-darkBlue mt-1">{(overview as any).totalFavorites || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-gov-blue text-white flex items-center justify-center rounded-full shadow-inner">
                  <i className="fas fa-heart text-xl"></i>
                </div>
              </div>

            </div>

            {/* PAINEL INFERIOR: TRILHA RÁPIDA E AÇÕES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="lg:col-span-2 bg-white border border-gov-border rounded shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
                  <h3 className="font-bold text-gov-darkBlue">
                    <i className="fas fa-history mr-2"></i> Atividades Recentes
                  </h3>
                  <button onClick={() => setActiveTab('reports')} className="text-sm text-gov-blue hover:underline font-semibold">
                    Ver Histórico Completo
                  </button>
                </div>
                <div className="p-0">
                  {!(overview as any).recentActivities || (overview as any).recentActivities.length === 0 ? (
                    <p className="p-6 text-gray-500 text-sm text-center">Nenhuma atividade registrada ainda.</p>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {(overview as any).recentActivities.map((log: any) => (
                        <li key={log.id} className="p-4 hover:bg-gray-50 transition flex items-start gap-4">
                          <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-white ${log.method === 'POST' ? 'bg-gov-green' : log.method === 'DELETE' ? 'bg-gov-red' : 'bg-gov-yellow'}`}>
                            {log.method === 'POST' && <i className="fas fa-plus text-xs"></i>}
                            {log.method === 'DELETE' && <i className="fas fa-trash text-xs"></i>}
                            {(log.method === 'PUT' || log.method === 'PATCH') && <i className="fas fa-pen text-xs"></i>}
                            {log.method === 'GET' && <i className="fas fa-search text-xs"></i>}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {log.user ? log.user.name : 'Sistema'} realizou um <span className="font-mono bg-gray-200 px-1.5 py-0.5 rounded text-xs mx-1">{log.method}</span> em <span className="text-gov-blue">{log.route}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1.5">
                              <i className="far fa-clock mr-1"></i> {new Date(log.timestamp).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gov-border rounded shadow-sm h-fit">
                <div className="px-6 py-4 border-b border-gray-200 bg-white">
                  <h3 className="font-bold text-gov-darkBlue">
                    Ações Rápidas
                  </h3>
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <Button variant="outline" onClick={() => setIsModalOpen(true)} className="w-full justify-start text-sm">
                    <i className="fas fa-user-plus w-5"></i> Cadastrar Novo Usuário
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/dashboard/categories/new')} className="w-full justify-start text-sm">
                    <i className="fas fa-tags w-5"></i> Criar Categoria
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/dashboard/products/new')} className="w-full justify-start text-sm">
                    <i className="fas fa-box w-5"></i> Adicionar Produto
                  </Button>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white p-6 border border-gov-border rounded shadow-sm">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="text-xl font-bold text-gov-darkBlue">Lista de Usuários</h3>

              <form onSubmit={handleUsersSearch} className="flex gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Pesquisar por nome ou email..."
                  value={usersSearch}
                  onChange={(e) => setUsersSearch(e.target.value)}
                  className="px-3 py-1.5 border border-gov-border rounded focus:ring-1 focus:ring-gov-blue outline-none text-sm w-full md:w-64"
                />
                <Button type="submit" className="!py-1.5 text-sm">Pesquisar</Button>
                <Button type="button" onClick={() => setIsModalOpen(true)} className="!py-1.5 text-sm ml-4">
                  + Novo Usuário
                </Button>
              </form>
            </div>

            {loading ? <p className="text-center py-4 text-gray-500">Carregando...</p> : (
              <>
                <Table
                  data={users}
                  keyExtractor={(item) => item.id}
                  columns={[
                    { key: 'id', label: 'ID' },
                    { key: 'name', label: 'Nome' },
                    { key: 'email', label: 'E-mail' },
                    {
                      key: 'role', label: 'Perfil', render: (row) => (
                        <span className={`px-2 py-1 rounded text-xs font-bold ${row.role === 'ADMIN' ? 'bg-gov-darkBlue text-white' : 'bg-gray-200 text-gray-700'}`}>
                          {row.role}
                        </span>
                      )
                    },
                    { key: 'createdAt', label: 'Data de Cadastro', render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR') },
                  ]}
                />
                <Pagination currentPage={usersPage} totalPages={usersTotalPages} onPageChange={setUsersPage} />
              </>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white p-6 border border-gov-border rounded shadow-sm">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h3 className="text-xl font-bold text-gov-darkBlue">Relatório de Uso do Sistema</h3>
                <p className="text-sm text-gray-500">Trilha de auditoria das ações realizadas na API.</p>
              </div>

              <form onSubmit={handleReportsSearch} className="flex gap-2 w-full md:w-auto items-center">
                <input
                  type="text"
                  placeholder="Pesquisar rota ou ação..."
                  value={reportsSearch}
                  onChange={(e) => setReportsSearch(e.target.value)}
                  className="px-3 py-1.5 border border-gov-border rounded focus:ring-1 focus:ring-gov-blue outline-none text-sm w-full md:w-48"
                />
                <select
                  value={reportsMethod}
                  onChange={(e) => { setReportsMethod(e.target.value); setReportsPage(1); }}
                  className="px-3 py-1.5 border border-gov-border rounded outline-none text-sm bg-white"
                >
                  <option value="">Todos os Métodos</option>
                  <option value="POST">POST (Criação)</option>
                  <option value="PUT">PUT (Atualização)</option>
                  <option value="PATCH">PATCH (Atualização)</option>
                  <option value="DELETE">DELETE (Exclusão)</option>
                </select>
                <Button type="submit" className="!py-1.5 text-sm">Filtrar</Button>
              </form>
            </div>

            {loading ? <p className="text-center py-4 text-gray-500">Carregando...</p> : (
              <>
                <Table
                  data={reports}
                  keyExtractor={(item) => item.id}
                  columns={[
                    { key: 'id', label: 'Log ID' },
                    {
                      key: 'method', label: 'Ação', render: (row) => {
                        let color = 'bg-gray-200 text-gray-700';
                        if (row.method === 'POST') color = 'bg-gov-green text-white';
                        if (row.method === 'DELETE') color = 'bg-gov-red text-white';
                        if (row.method === 'PATCH' || row.method === 'PUT') color = 'bg-gov-yellow text-black';
                        return <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>{row.method}</span>;
                      }
                    },
                    { key: 'route', label: 'Recurso / Rota' },
                    { key: 'user', label: 'Autor', render: (row) => row.user ? `${row.user.name} (${row.user.email})` : 'Sistema/Anônimo' },
                    { key: 'timestamp', label: 'Data/Hora', render: (row) => new Date(row.timestamp).toLocaleString('pt-BR') },
                  ]}
                />
                <Pagination currentPage={reportsPage} totalPages={reportsTotalPages} onPageChange={setReportsPage} />
              </>
            )}
          </div>
        )}
      </main>

      {/* MODAL DE CRIAÇÃO DE USUÁRIO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-md border border-gov-border">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white rounded-t">
              <h3 className="text-lg font-bold text-gov-darkBlue">Cadastrar Novo Usuário</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <Input label="Nome Completo" type="text" placeholder="Ex: João da Silva" value={name} onChange={(e) => setName(e.target.value)} required state={modalError ? 'error' : modalSuccess ? 'success' : 'default'} />
              <Input label="E-mail" type="email" placeholder="Ex: joao@instituicao.gov" value={email} onChange={(e) => setEmail(e.target.value)} required state={modalError ? 'error' : modalSuccess ? 'success' : 'default'} />

              <div className="flex flex-col mb-4">
                <label className="mb-1 text-sm font-semibold text-gov-text">Perfil de Acesso</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border border-gov-border rounded bg-white transition-colors focus:border-gov-blue focus:ring-1 focus:ring-gov-blue outline-none h-[42px]">
                  <option value="STANDARD">Usuário Padrão</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <Input label="Senha Inicial" type="password" placeholder="Crie uma senha forte" value={password} onChange={(e) => setPassword(e.target.value)} required state={modalError ? 'error' : modalSuccess ? 'success' : 'default'} helperText={modalError || modalSuccess} />

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={modalLoading}>{modalLoading ? 'Salvando...' : 'Salvar'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
