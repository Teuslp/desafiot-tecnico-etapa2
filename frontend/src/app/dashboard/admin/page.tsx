"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports'>('overview');
  
  const [overview, setOverview] = useState({ totalUsers: 0, totalProducts: 0, totalCategories: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal de Novo Usuário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STANDARD');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const res = await api.get('/admin/overview');
        setOverview(res.data);
      } else if (activeTab === 'users') {
        const res = await api.get('/users');
        setUsers(res.data);
      } else if (activeTab === 'reports') {
        const res = await api.get('/admin/reports');
        setReports(res.data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do painel admin:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    setModalLoading(true);

    try {
      await api.post('/users', { name, email, password, role });
      setModalSuccess('Usuário cadastrado com sucesso!');
      
      // Limpar formulário e atualizar a lista
      setTimeout(() => {
        setIsModalOpen(false);
        setModalSuccess('');
        setName(''); setEmail(''); setPassword(''); setRole('STANDARD');
        fetchData(); // Recarrega a tabela de usuários
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

        {/* Abas */}
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

        {loading ? (
          <div className="py-10 text-center text-gray-500 font-semibold">Carregando informações...</div>
        ) : (
          <div className="bg-white p-6 border border-gov-border rounded shadow-sm">
            
            {/* CONTEÚDO: VISÃO GERAL */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gov-lightBlue p-6 rounded border border-blue-200">
                  <h3 className="text-gov-darkBlue font-bold text-lg">Total de Usuários</h3>
                  <p className="text-4xl font-bold text-gov-blue mt-2">{overview.totalUsers}</p>
                </div>
                <div className="bg-green-50 p-6 rounded border border-green-200">
                  <h3 className="text-gov-darkBlue font-bold text-lg">Total de Produtos</h3>
                  <p className="text-4xl font-bold text-gov-green mt-2">{overview.totalProducts}</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded border border-yellow-200">
                  <h3 className="text-gov-darkBlue font-bold text-lg">Total de Categorias</h3>
                  <p className="text-4xl font-bold text-gov-yellow mt-2">{overview.totalCategories}</p>
                </div>
              </div>
            )}

            {/* CONTEÚDO: USUÁRIOS */}
            {activeTab === 'users' && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gov-darkBlue">Lista de Usuários</h3>
                  <Button 
                    onClick={() => setIsModalOpen(true)} 
                    className="text-sm !py-2"
                  >
                    + Novo Usuário
                  </Button>
                </div>
                <Table 
                  data={users}
                  keyExtractor={(item) => item.id}
                  columns={[
                    { key: 'id', label: 'ID' },
                    { key: 'name', label: 'Nome' },
                    { key: 'email', label: 'E-mail' },
                    { key: 'role', label: 'Perfil', render: (row) => (
                      <span className={`px-2 py-1 rounded text-xs font-bold ${row.role === 'ADMIN' ? 'bg-gov-darkBlue text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {row.role}
                      </span>
                    )},
                    { key: 'createdAt', label: 'Data de Cadastro', render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR') },
                  ]}
                />
              </div>
            )}

            {/* CONTEÚDO: RELATÓRIOS */}
            {activeTab === 'reports' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gov-darkBlue">Relatório de Uso do Sistema</h3>
                  <p className="text-sm text-gray-500">Trilha de auditoria das ações realizadas na API.</p>
                </div>
                <Table 
                  data={reports}
                  keyExtractor={(item) => item.id}
                  columns={[
                    { key: 'id', label: 'Log ID' },
                    { key: 'method', label: 'Ação', render: (row) => {
                        let color = 'bg-gray-200 text-gray-700';
                        if (row.method === 'POST') color = 'bg-gov-green text-white';
                        if (row.method === 'DELETE') color = 'bg-gov-red text-white';
                        if (row.method === 'PATCH' || row.method === 'PUT') color = 'bg-gov-yellow text-black';
                        return <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>{row.method}</span>;
                    }},
                    { key: 'route', label: 'Recurso / Rota' },
                    { key: 'user', label: 'Autor', render: (row) => row.user ? `${row.user.name} (${row.user.email})` : 'Sistema/Anônimo' },
                    { key: 'timestamp', label: 'Data/Hora', render: (row) => new Date(row.timestamp).toLocaleString('pt-BR') },
                  ]}
                />
              </div>
            )}

          </div>
        )}
      </main>

      {/* MODAL DE CRIAÇÃO DE USUÁRIO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-md border border-gov-border">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t">
              <h3 className="text-lg font-bold text-gov-darkBlue">Cadastrar Novo Usuário</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500 font-bold">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <Input 
                label="Nome Completo"
                type="text"
                placeholder="Ex: João da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                state={modalError ? 'error' : modalSuccess ? 'success' : 'default'}
              />

              <Input 
                label="E-mail"
                type="email"
                placeholder="Ex: joao@instituicao.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                state={modalError ? 'error' : modalSuccess ? 'success' : 'default'}
              />

              <div className="flex flex-col mb-4">
                <label className="mb-1 text-sm font-semibold text-gov-text">Perfil de Acesso</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gov-border rounded bg-white transition-colors focus:border-gov-blue focus:ring-1 focus:ring-gov-blue outline-none h-[42px]"
                >
                  <option value="STANDARD">Usuário Padrão</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <Input 
                label="Senha Inicial"
                type="password"
                placeholder="Crie uma senha forte"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                state={modalError ? 'error' : modalSuccess ? 'success' : 'default'}
                helperText={modalError || modalSuccess}
              />

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={modalLoading}>
                  {modalLoading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
