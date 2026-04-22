import React from 'react';
import { Button } from './Button';

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
  // Converte a URL da imagem retornada pela API (ex: /uploads/products/xyz.jpg) para o caminho completo
  const imageUrl = product.imageUrl 
    ? `http://localhost:3000${product.imageUrl}` 
    : 'https://via.placeholder.com/300x200?text=Sem+Imagem';

  return (
    <div className="bg-white border border-gov-border rounded shadow-sm overflow-hidden flex flex-col transition-shadow hover:shadow-md">
      <div className="h-48 w-full bg-gray-100 relative">
        <img 
          src={imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1 flex-wrap justify-end">
          {product.categories.map((cat) => (
            <span key={cat.id} className="bg-gov-darkBlue text-white text-xs font-bold px-2 py-1 rounded-sm">
              {cat.name}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gov-darkBlue mb-1">{product.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-gov-green">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </span>
          <Button 
            variant="outline" 
            onClick={() => onFavorite(product.id)}
            className="!px-4 !py-1.5 text-xs"
          >
            ★ Favoritar
          </Button>
        </div>
      </div>
    </div>
  );
}
