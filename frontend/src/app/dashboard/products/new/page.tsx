"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Category {
  id: number;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Busca as categorias ao carregar a página
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Erro ao buscar categorias', err));
  }, []);

  const handleCategoryToggle = (id: number) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategoryIds.length === 0) {
      setError('Por favor, selecione ao menos uma categoria.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('categoryIds', selectedCategoryIds.join(','));

      if (image) {
        formData.append('image', image);
      }

      await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar produto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Header />

      <main className="main-content">
        {/* Hero Section */}
        <section className="page-hero mb-8 rounded-[1.5rem] px-6 py-8 text-white md:px-10 md:py-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="eyebrow mb-3 flex w-fit items-center gap-2 bg-white/10 text-white border-white/20">
                <i className="pi pi-plus-circle"></i>
                Novo Cadastro
              </span>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Cadastrar Produto</h1>
              <p className="mt-2 max-w-xl text-white/70">
                Adicione novos itens ao catálogo institucional preenchendo as informações técnicas abaixo.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              className="w-fit border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <i className="pi pi-arrow-left mr-2"></i>
              Voltar ao Painel
            </Button>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Form Side */}
          <form onSubmit={handleSubmit} className="surface-card space-y-8 rounded-[1.5rem] p-6 md:p-8">
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Título do Produto"
                  placeholder="Ex: Notebook Corporativo Pro"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="md:col-span-2"
                />

                <Input
                  label="Preço de Venda (R$)"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />

                <div className="flex flex-col relative">
                  <label className="mb-2 text-[0.72rem] font-black uppercase tracking-[0.2em] text-gov-blue">Categorias</label>
                  
                  <div 
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className={`flex min-h-[46px] cursor-pointer items-center gap-2 rounded-xl border bg-slate-50/50 px-3 py-2 transition-all ${
                      isCategoryDropdownOpen ? 'border-gov-blue ring-2 ring-gov-blue/10' : 'border-slate-200 hover:border-gov-blue/30'
                    }`}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCategoryIds.length === 0 ? (
                        <span className="text-sm font-medium text-slate-400">Selecione as categorias</span>
                      ) : (
                        categories.filter(c => selectedCategoryIds.includes(c.id)).map(cat => (
                          <span key={cat.id} className="flex items-center gap-1.5 rounded-lg bg-gov-blue px-2 py-1 text-[10px] font-bold text-white animate-in zoom-in-95 duration-200">
                            {cat.name}
                            <button 
                              type="button" 
                              onClick={(e) => { e.stopPropagation(); handleCategoryToggle(cat.id); }}
                              className="opacity-70 hover:opacity-100"
                            >
                              <i className="pi pi-times text-[8px]"></i>
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                    <i className={`pi pi-chevron-down ml-auto text-slate-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}></i>
                  </div>

                  {isCategoryDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsCategoryDropdownOpen(false)}></div>
                      <div className="absolute top-full left-0 z-20 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border border-slate-100 bg-white p-2 shadow-2xl animate-in slide-in-from-top-2">
                        {categories.map(cat => (
                          <div 
                            key={cat.id}
                            onClick={() => handleCategoryToggle(cat.id)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors cursor-pointer ${
                              selectedCategoryIds.includes(cat.id) ? 'bg-gov-blue/5 text-gov-blue' : 'hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                              selectedCategoryIds.includes(cat.id) ? 'bg-gov-blue border-gov-blue' : 'border-slate-300'
                            }`}>
                              {selectedCategoryIds.includes(cat.id) && <i className="pi pi-check text-[8px] text-white"></i>}
                            </div>
                            <span className="text-sm font-semibold">{cat.name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-[0.72rem] font-black uppercase tracking-[0.2em] text-gov-blue">Descrição Completa</label>
                <textarea
                  rows={5}
                  placeholder="Destaque as principais características, especificações técnicas e benefícios do produto."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-gov-darkBlue outline-none transition-all focus:border-gov-blue/40 focus:ring-4 focus:ring-gov-blue/5 placeholder:italic placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-[0.72rem] font-black uppercase tracking-[0.2em] text-gov-blue">Imagem de Destaque</label>
                <div className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/30 py-8 transition-all hover:border-gov-blue/30 hover:bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 z-10 cursor-pointer opacity-0"
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm text-gov-blue group-hover:scale-110 transition-transform">
                    <i className="pi pi-upload text-xl"></i>
                  </div>
                  <p className="mt-4 text-sm font-bold text-gov-darkBlue">
                    {image ? image.name : "Clique ou arraste uma imagem aqui"}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    PNG, JPG ou WEBP até 5MB
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600 animate-in fade-in slide-in-from-top-1">
                <i className="pi pi-exclamation-circle text-lg"></i>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-6 border-t border-slate-100 sm:flex-row sm:justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[11px]"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="h-12 px-10 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-900/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <i className="pi pi-spin pi-spinner"></i>
                    Salvando...
                  </span>
                ) : 'Confirmar Cadastro'}
              </Button>
            </div>
          </form>

          {/* Preview Side */}
          <div className="space-y-6">
            <div className="surface-card rounded-[1.5rem] p-6">
              <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Pré-visualização</h3>
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="aspect-video relative bg-slate-50 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                      <i className="pi pi-image text-4xl"></i>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Sem imagem</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedCategoryIds.length > 0 ? (
                      categories.filter(c => selectedCategoryIds.includes(c.id)).slice(0, 2).map(cat => (
                        <span key={cat.id} className="bg-slate-100 text-[9px] font-black uppercase px-2 py-0.5 rounded text-slate-500">
                          {cat.name}
                        </span>
                      ))
                    ) : (
                      <span className="bg-slate-50 text-[9px] font-black uppercase px-2 py-0.5 rounded text-slate-300">Categoria</span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-gov-darkBlue truncate">{title || 'Título do Produto'}</h4>
                  <p className="mt-1 text-lg font-black text-gov-blue">
                    {price ? `R$ ${parseFloat(price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
                  </p>
                </div>
              </div>
            </div>

            <div className="surface-card rounded-[1.5rem] p-6 bg-gov-blue/5 border-gov-blue/10">
              <div className="flex items-start gap-3">
                <i className="pi pi-info-circle mt-1 text-gov-blue"></i>
                <div>
                  <h4 className="text-sm font-bold text-gov-darkBlue">Dica de Cadastro</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Use títulos claros e objetivos. Imagens com fundo neutro ajudam na visualização institucional do catálogo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
