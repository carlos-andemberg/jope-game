"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  Clock, 
  Loader2, 
  ChevronRight,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [metricas, setMetricas] = useState({
    faturamento: 0,
    pedidosTotal: 0,
    produtosTotal: 0,
    alertaEstoque: [] as any[],
    ultimosPedidos: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Escuta Pedidos para Faturamento e Atividade Recente
    const qPedidos = query(collection(db, "pedidos"), orderBy("criadoEm", "desc"));
    const unsubPedidos = onSnapshot(qPedidos, (snapshot) => {
      let totalFaturado = 0;
      const todosPedidos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        // Soma faturamento apenas de pedidos com status "Finalizado"
        if (data.status === "Finalizado") {
          totalFaturado += data.valorTotal || 0;
        }
      });

      setMetricas(prev => ({ 
        ...prev, 
        faturamento: totalFaturado, 
        pedidosTotal: snapshot.size,
        ultimosPedidos: todosPedidos.slice(0, 4) // Mostra os 4 pedidos mais recentes
      }));
    });

    // 2. Escuta Produtos para Total e Alertas de Stock
    const unsubProdutos = onSnapshot(collection(db, "produtos"), (snapshot) => {
      const todosProdutos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const stockBaixo = todosProdutos.filter((p: any) => p.estoque <= 3);
      
      setMetricas(prev => ({ 
        ...prev, 
        produtosTotal: snapshot.size, 
        alertaEstoque: stockBaixo 
      }));
      setLoading(false);
    });

    return () => {
      unsubPedidos();
      unsubProdutos();
    };
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" aria-label="Carregando dados..." />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-10">
      
      {/* Cabeçalho */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white tracking-wider mb-2 uppercase">Visão Geral</h1>
        <p className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em]">Estatísticas em tempo real da JOPE GAME</p>
      </div>

      {/* Grid de Cards Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        
        {/* Card Faturamento */}
        <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-[32px] shadow-xl relative overflow-hidden group">
          <div className="bg-zinc-950 w-12 h-12 rounded-2xl flex items-center justify-center border border-zinc-800 mb-6 group-hover:border-yellow-400/50 transition-colors">
            <DollarSign className="w-6 h-6 text-yellow-400" aria-hidden="true" />
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Lucro Confirmado</p>
          <h2 className="text-3xl font-black text-white">
            R$ {metricas.faturamento.toFixed(2).replace('.', ',')}
          </h2>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase">
             <TrendingUp className="w-3 h-3 text-green-500" /> Apenas itens finalizados
          </div>
        </section>

        {/* Card Pedidos */}
        <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-[32px] shadow-xl">
          <div className="bg-zinc-950 w-12 h-12 rounded-2xl flex items-center justify-center border border-zinc-800 mb-6">
            <ShoppingBag className="w-6 h-6 text-yellow-400" aria-hidden="true" />
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total de Pedidos</p>
          <h2 className="text-3xl font-black text-white">{metricas.pedidosTotal}</h2>
          <Link href="/admin/pedidos" className="mt-4 inline-block text-[10px] font-black text-yellow-400 uppercase tracking-widest hover:underline">
            Gerenciar Vendas &rarr;
          </Link>
        </section>

        {/* Card Produtos */}
        <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-[32px] shadow-xl">
          <div className="bg-zinc-950 w-12 h-12 rounded-2xl flex items-center justify-center border border-zinc-800 mb-6">
            <Package className="w-6 h-6 text-yellow-400" aria-hidden="true" />
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Itens no Catálogo</p>
          <h2 className="text-3xl font-black text-white">{metricas.produtosTotal}</h2>
          <Link href="/admin/produtos" className="mt-4 inline-block text-[10px] font-black text-yellow-400 uppercase tracking-widest hover:underline">
            Ver Estoque &rarr;
          </Link>
        </section>

      </div>

      {/* Seção Inferior: Alertas e Atividade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Alerta de Stock Crítico */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-red-500/10 p-2 rounded-xl text-red-500 border border-red-500/20">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Stock Crítico</h2>
          </div>
          
          <div className="space-y-4">
            {metricas.alertaEstoque.length > 0 ? (
              metricas.alertaEstoque.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-5 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <span className="text-zinc-200 font-bold uppercase text-xs tracking-tight">{p.nome}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-zinc-600 uppercase">Apenas</span>
                    <span className="bg-red-500/20 text-red-500 px-4 py-1 rounded-full text-xs font-black">
                      {p.estoque} un.
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest italic">Todo o stock está em conformidade.</p>
              </div>
            )}
          </div>
        </section>

        {/* Atividade Recente (Dinâmica) */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 blur-[100px] opacity-5" aria-hidden="true"></div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400/10 p-2 rounded-xl text-yellow-400 border border-yellow-400/20">
                <Clock className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Vendas Recentes</h2>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            {metricas.ultimosPedidos.length > 0 ? (
              metricas.ultimosPedidos.map((pedido) => (
                <Link 
                  href="/admin/pedidos" 
                  key={pedido.id} 
                  aria-label={`Ver detalhes do pedido ${pedido.id.slice(0, 5)}`}
                  className="flex items-center justify-between p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800 hover:border-yellow-400/30 transition-all group shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                      #{pedido.id.slice(0, 5).toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        pedido.status === 'Pendente' ? 'bg-yellow-500' : 
                        pedido.status === 'Finalizado' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-[10px] text-zinc-400 font-black uppercase tracking-tighter">
                        {pedido.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-white text-sm">
                      R$ {pedido.valorTotal.toFixed(2).replace('.', ',')}
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-yellow-400 transition-colors" aria-hidden="true" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest italic">Aguardando primeira venda...</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}