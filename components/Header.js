"use client";
import React from 'react';

export default function Header(){
  return (
    <header className="flex items-center justify-between py-4">
      <a href="/" className="flex items-center gap-3">
        <img src="/logo.svg" alt="Vulpes" className="w-10 h-10" />
        <span className="logo-title text-xl">VULPES</span>
      </a>
      <nav>
        <a href="/admin" className="text-sm px-3 py-1 border rounded">Admin</a>
      </nav>
    </header>
  );
}
