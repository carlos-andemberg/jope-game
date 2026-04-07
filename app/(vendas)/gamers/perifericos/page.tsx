"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { useCart } from "../../../../context/CartContext";
import { ShoppingCart, Package, Plus, Loader2, ArrowLeft } from "lucide-react";

export default function VitrinePerifericos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { adicionarAoCarrinho, totalItens } = useCart();

  useEffect(() => {
    // Busca no Firestore apenas produtos da categoria "Periféricos"
    const q = query(
      collection(db, "produtos"), 
      where("categoria", "==", "Periféricos")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setProdutos(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-yellow-400">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-zinc-950 p-6 font-sans pb-20">
      
      {/* Cabeçalho */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8 mt-4">
        <Link href="/gamers" className="text-zinc-500 hover:text-yellow-400 transition-colors font-bold flex items-center gap-2 uppercase text-sm tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-2xl md:text-3xl font-black text-center text-yellow-400 tracking-wider">
          PERIFÉRICOS
        </h1>
        
        <Link href="/carrinho" className="relative cursor-pointer text-zinc-400 hover:text-yellow-400 transition-colors flex items-center justify-center p-3 bg-zinc-900 rounded-full border border-zinc-800">
          <ShoppingCart className="w-6 h-6" />
          {totalItens > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-zinc-950 text-xs font-black w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
              {totalItens}
            </span>
          )}
        </Link>
      </div>

      <p className="text-center text-zinc-400 mb-12 max-w-xl mx-auto font-medium">
        Equipamentos de elite para o seu setup gamer.
      </p>

      {/* Grade de Produtos Reais */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {produtos.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
            <Package className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest">Nenhum periférico cadastrado ainda.</p>
          </div>
        ) : (
          produtos.map((produto) => (
            <div 
              key={produto.id} 
              className="group bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-3xl p-4 flex flex-col hover:border-yellow-400 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-full aspect-square bg-zinc-950 rounded-2xl flex items-center justify-center mb-5 border border-zinc-800/50 overflow-hidden relative">
                {produto.imagemUrl ? (
                  <img 
                    src={produto.imagemUrl} 
                    alt={produto.nome} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <Package className="w-12 h-12 text-zinc-800" />
                )}
              </div>

              <h2 className="text-sm md:text-base font-bold text-zinc-200 line-clamp-2 h-10 mb-1">
                {produto.nome}
              </h2>
              
              <div className="flex items-end gap-1 mb-5">
                <span className="text-yellow-400/70 text-sm font-bold">R$</span>
                <span className="text-yellow-400 font-black text-2xl leading-none">
                  {Number(produto.preco).toFixed(2).replace('.', ',')}
                </span>
              </div>

              {produto.estoque > 0 ? (
                <button 
                  onClick={() => adicionarAoCarrinho(produto)}
                  className="mt-auto w-full bg-zinc-800 hover:bg-yellow-400 text-zinc-300 hover:text-zinc-950 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Carrinho
                </button>
              ) : (
                <button disabled className="mt-auto w-full bg-zinc-950 text-zinc-700 py-3 rounded-xl font-bold uppercase text-xs border border-zinc-900 cursor-not-allowed">
                  Esgotado
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}