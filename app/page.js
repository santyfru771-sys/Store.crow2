"use client";

import React from 'react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import '../globals.css';

export default function Home(){
  return (
    <main className="p-4 max-w-5xl mx-auto">
      <Header />
      <section className="mt-6">
        <ProductGrid />
      </section>
    </main>
  );
}
