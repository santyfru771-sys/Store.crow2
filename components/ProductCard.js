"use client";
import React from 'react';

export default function ProductCard({ product }){
  return (
    <a href={`/product/${product.id}`.replace('/product/','/product/')} className="block bg-white rounded overflow-hidden shadow">
      <img src={product.imagenes && product.imagenes[0]} alt={product.titulo} className="w-full h-40 object-cover" />
      <div className="p-3">
        <p className="text-sm text-gray-500">{product.categoria}</p>
        <h3 className="font-semibold mt-1">{product.titulo}</h3>
        <p className="price mt-2">${product.precio}</p>
      </div>
    </a>
  );
}
