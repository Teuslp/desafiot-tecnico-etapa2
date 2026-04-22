import React from 'react';
import { BrCard, BrButton } from '@govbr-ds/react-components';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  categories: { id: number; name: string }[];
}

interface ProductCardProps {
  product: Product;
  onFavorite: (id: number) => void;
}

export function ProductCard({ product, onFavorite }: ProductCardProps) {
  const imageUrl = product.imageUrl 
    ? `http://localhost:3000${product.imageUrl}` 
    : 'https://via.placeholder.com/300x200?text=Sem+Imagem';

  return (
    <BrCard className="h-full flex flex-col hover:shadow-lg transition-shadow border-t-4 border-gov-blue">
      {/* Imagem do Produto */}
      <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {product.categories.map((cat) => (
            <span key={cat.id} className="bg-gov-darkBlue/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              {cat.name.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      
      {/* Conteúdo do Card */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-black text-gov-darkBlue leading-tight mb-2 line-clamp-1">{product.title}</h3>
        <p className="text-xs text-gray-600 mb-4 line-clamp-3 flex-1 leading-relaxed">
          {product.description}
        </p>
        
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Preço</span>
            <span className="text-lg font-black text-gov-blue">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </span>
          </div>
          
          <BrButton 
            secondary 
            circle 
            onClick={() => onFavorite(product.id)}
            title="Favoritar"
            className="hover:text-red-500 transition-colors shadow-sm"
          >
            <i className="far fa-heart"></i>
          </BrButton>
        </div>
      </div>
    </BrCard>
  );
}
