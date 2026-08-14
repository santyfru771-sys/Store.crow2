"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import Header from '../../../components/Header';

export default function ProductPage({ params }){
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load(){
      try{
        const d = await getDoc(doc(db, 'productos', id));
        if(d.exists()) setProduct({ id: d.id, ...d.data() });
      }catch(e){
        console.error(e);
      }finally{ setLoading(false); }
    }
    load();
  },[id]);

  if(loading) return (<div className="p-4"><Header /><p>Cargando...</p></div>);
  if(!product) return (<div className="p-4"><Header /><p>Producto no encontrado</p></div>);

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const message = encodeURIComponent(`Hola! Estoy interesado en el producto: ${product.titulo} - $${product.precio}`);
  const waLink = `https://wa.me/${phone}?text=${message}`;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Header />
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <img src={product.imagenes && product.imagenes[0]} alt={product.titulo} className="w-full h-72 object-cover rounded" />
        <p className="text-sm text-gray-500 mt-3">{product.categoria}</p>
        <h1 className="text-2xl font-semibold mt-2">{product.titulo}</h1>
        <p className="mt-4 text-gray-700">{product.descripcion}</p>
        <p className="mt-4 price text-xl">${product.precio}</p>
        <a href={waLink} target="_blank" rel="noreferrer" className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded">Comprar por WhatsApp</a>
      </div>
    </div>
  );
}
