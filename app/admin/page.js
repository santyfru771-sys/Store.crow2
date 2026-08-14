"use client";
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { auth, db, storage } from '../../lib/firebaseClient';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function AdminPage(){
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [productos, setProductos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{
      setUser(u);
      setLoadingUser(false);
    });
    return ()=>unsub();
  },[]);

  useEffect(()=>{
    const q = collection(db, 'productos');
    const unsub = onSnapshot(q, (snap)=>{
      const arr = [];
      snap.forEach(d=> arr.push({ id: d.id, ...d.data() }));
      setProductos(arr.sort((a,b)=> b.fechaCreacion?.seconds - a.fechaCreacion?.seconds));
    });
    return ()=>unsub();
  },[]);

  async function handleLogin(e){
    e.preventDefault();
    try{
      await signInWithEmailAndPassword(auth, email, password);
    }catch(err){
      alert('Error de login: '+err.message);
    }
  }

  async function handleLogout(){
    await signOut(auth);
  }

  async function handleCreate(e){
    e.preventDefault();
    if(!titulo || !precio) return alert('Completa titulo y precio');
    setSaving(true);
    try{
      let imageUrls = [];
      if(file){
        const storageRef = ref(storage, `productos/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await new Promise((res, rej)=>{
          uploadTask.on('state_changed', ()=>{}, rej, ()=>res());
        });
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
      await addDoc(collection(db,'productos'),{
        titulo,
        descripcion,
        precio: Number(precio),
        categoria,
        imagenes: imageUrls,
        activo: true,
        fechaCreacion: serverTimestamp()
      });
      setTitulo(''); setDescripcion(''); setPrecio(''); setCategoria(''); setFile(null);
    }catch(err){
      console.error(err); alert('Error al guardar: '+err.message);
    }finally{ setSaving(false); }
  }

  async function toggleActivo(prod){
    try{ await updateDoc(doc(db,'productos',prod.id),{ activo: !prod.activo }); }catch(e){ console.error(e); }
  }

  async function eliminar(prod){
    if(!confirm('Eliminar producto?')) return;
    try{ await deleteDoc(doc(db,'productos',prod.id)); }catch(e){ console.error(e); }
  }

  if(loadingUser) return (<div className="p-4"><Header /><p>Cargando...</p></div>);

  if(!user) return (
    <div className="p-4 max-w-md mx-auto">
      <Header />
      <h2 className="mt-6 text-xl">Login Administrador</h2>
      <form onSubmit={handleLogin} className="mt-4 flex flex-col gap-2">
        <input className="p-2 border rounded" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="p-2 border rounded" placeholder="contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-accent text-white px-4 py-2 rounded mt-2" type="submit">Ingresar</button>
      </form>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Header />
      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-xl">Panel Admin</h2>
        <div>
          <button onClick={handleLogout} className="px-3 py-1 border rounded">Cerrar sesión</button>
        </div>
      </div>

      <section className="mt-4 bg-white p-4 rounded">
        <h3 className="font-semibold">Crear producto</h3>
        <form onSubmit={handleCreate} className="mt-3 grid grid-cols-1 gap-2">
          <input className="p-2 border rounded" placeholder="Título" value={titulo} onChange={e=>setTitulo(e.target.value)} />
          <textarea className="p-2 border rounded" placeholder="Descripción" value={descripcion} onChange={e=>setDescripcion(e.target.value)} />
          <input className="p-2 border rounded" placeholder="Precio" value={precio} onChange={e=>setPrecio(e.target.value)} />
          <input className="p-2 border rounded" placeholder="Categoría" value={categoria} onChange={e=>setCategoria(e.target.value)} />
          <input type="file" onChange={e=>setFile(e.target.files[0])} />
          <button disabled={saving} className="bg-accent text-white px-4 py-2 rounded">{saving ? 'Guardando...' : 'Crear'}</button>
        </form>
      </section>

      <section className="mt-6">
        <h3 className="font-semibold">Productos</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {productos.map(p=> (
            <div key={p.id} className="bg-white p-3 rounded shadow">
              <img src={p.imagenes && p.imagenes[0]} alt={p.titulo} className="w-full h-40 object-cover rounded" />
              <p className="text-sm text-gray-500">{p.categoria}</p>
              <h4 className="font-semibold">{p.titulo}</h4>
              <p className="price">${p.precio}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={()=>toggleActivo(p)} className="px-2 py-1 border rounded">{p.activo ? 'Ocultar' : 'Mostrar'}</button>
                <button onClick={()=>eliminar(p)} className="px-2 py-1 border rounded">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
