"use client";

import React, { useState } from 'react';
import { Card } from '@uigovpe/components';

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  categories: Category[];
}

interface ProductCardProps {
  product: Product;
  onFavorite: (id: number) => void;
}

export function ProductCard({ product, onFavorite }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getImageUrl = () => {
    const fallbackImage = 'https://images.unsplash.com/photo-1586769852044-692d6e3703a0?q=80&w=300&h=200&auto=format&fit=crop';
    if (!product.imageUrl || imageFailed) return fallbackImage;
    if (product.imageUrl.startsWith('http')) return product.imageUrl;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    return `${baseUrl}${product.imageUrl}`;
  };

  const maxVisibleCategories = 2;
  const visibleCategories = product.categories.slice(0, maxVisibleCategories);
  const hiddenCategoriesCount = product.categories.length - maxVisibleCategories;

  const header = (
    <div className="group/img relative h-52 w-full overflow-hidden bg-gray-50 sm:h-56">
      <img
        src={getImageUrl()}
        alt={`Imagem de ${product.title}`}
        onError={() => setImageFailed(true)}
        className="h-full w-full object-cover transition-transform duration-1000 group-hover/img:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-gov-darkBlue/40 via-transparent to-transparent opacity-60"></div>

      <div className="absolute left-3 top-3 z-10 flex max-w-[85%] flex-wrap gap-2 sm:left-4 sm:top-4">
        {visibleCategories.map((cat) => (
          <span
            key={cat.id}
            className="rounded-full border border-white/50 bg-white/80 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-gov-darkBlue shadow-lg backdrop-blur-md transition-transform hover:scale-105"
          >
            {cat.name}
          </span>
        ))}
        {hiddenCategoriesCount > 0 && (
          <span className="rounded-full bg-gov-yellow px-2 py-1 text-[9px] font-black uppercase text-gov-darkBlue shadow-lg">
            +{hiddenCategoriesCount}
          </span>
        )}
      </div>

      <div className="absolute bottom-3 left-3 z-10 sm:bottom-4 sm:left-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-gov-blue text-white shadow-lg">
          <i className="pi pi-box text-sm"></i>
        </div>
      </div>
    </div>
  );

  const footer = (
    <div className="flex items-center justify-between gap-4 border-t border-gray-50 bg-gray-50/20 px-4 py-4 sm:px-5">
      <div className="flex min-w-0 flex-col">
        <span className="mb-1 text-[9px] font-black uppercase leading-none tracking-[0.2em] text-gray-400">
          Preco medio
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-bold text-gov-blue">R$</span>
          <span className="truncate text-xl font-black tracking-tight text-gov-darkBlue">
            {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => onFavorite(product.id)}
          className={`
            flex h-10 w-10 items-center justify-center rounded-xl border shadow-md transition-all duration-300
            ${isHovered
              ? 'scale-110 border-red-50 bg-white text-red-500 hover:bg-red-500 hover:text-white'
              : 'border-gray-100 bg-white text-gray-300'}
          `}
        >
          <i className="pi pi-heart-fill text-xl"></i>
        </button>
      </div>
    </div>
  );

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group/card h-full animate-in fade-in zoom-in-95 duration-500"
    >
      <Card
        header={header}
        footer={footer}
        className={`
          h-full flex flex-col overflow-hidden rounded-[1rem] border bg-white transition-all duration-500
          ${isHovered
            ? 'border-gov-blue/10 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.12)] -translate-y-1.5'
            : 'border-transparent shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)]'}
        `}
      >
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3
            className={`
              mb-3 line-clamp-2 text-lg font-black leading-tight transition-colors duration-300
              ${isHovered ? 'text-gov-blue' : 'text-gov-darkBlue'}
            `}
          >
            {product.title}
          </h3>
          <p className="line-clamp-4 text-xs font-medium leading-relaxed text-gray-400">
            {product.description || 'Este item faz parte do inventario oficial do sistema de gestao de produtos do Governo de Pernambuco.'}
          </p>
        </div>
      </Card>
    </div>
  );
}
