"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebaseClient';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import ProductCard from './ProductCard';

export default function ProductGrid(){
  const [productos, setProductos] = useState([]);
  const [qText, setQText] = useState('');

  useEffect(()=>{
    const q = query(collection(db,'productos'), where('activo','==', true));
    const unsub = onSnapshot(q, (snap)=>{
      const arr = [];
      snap.forEach(d=> arr.push({ id: d.id, ...d.data() }));
      setProductos(arr);
    });
    return ()=>unsub();
  },[]);

  const filtered = productos.filter(p=> p.titulo.toLowerCase().includes(qText.toLowerCase()) || p.categoria.toLowerCase().includes(qText.toLowerCase()));

  return (
    <div>
      <div className="flex items-center gap-2">
        <input value={qText} onChange={e=>setQText(e.target.value)} placeholder="Buscar" className="p-2 border rounded flex-1" />
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p=> <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
