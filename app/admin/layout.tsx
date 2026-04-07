"use client";

import { useAuth } from "@/lib/auth";
import { auth } from "@/lib/auth"; // Para o signOut
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
// Importando todos os ícones necessários
import { LayoutDashboard, Package, ShoppingBag, LogOut, Lock } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-yellow-400 font-bold animate-pulse uppercase tracking-widest">
          Verificando Acesso...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row font-sans text-slate-100">
      
      {/* Menu Lateral (Sidebar) */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col gap-8 md:min-h-screen">
        <h2 className="text-2xl font-black text-yellow-400 tracking-widest flex items-center gap-2">
          <Lock className="w-6 h-6" /> JOPE ADMIN
        </h2>
        
        {/* AQUI ESTÃO OS LINKS QUE ESTAVAM FALTANDO NO SEU PRINT */}
        <nav className="flex flex-col gap-4 flex-1">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 text-zinc-400 hover:text-yellow-400 transition-colors font-bold uppercase text-xs tracking-widest p-2"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          
          <Link 
            href="/admin/produtos" 
            className="flex items-center gap-3 text-zinc-400 hover:text-yellow-400 transition-colors font-bold uppercase text-xs tracking-widest p-2"
          >
            <Package className="w-5 h-5" /> Produtos e Estoque
          </Link>
          
          <Link 
            href="/admin/pedidos" 
            className="flex items-center gap-3 text-zinc-400 hover:text-yellow-400 transition-colors font-bold uppercase text-xs tracking-widest p-2"
          >
            <ShoppingBag className="w-5 h-5" /> Pedidos
          </Link>
        </nav>

        {/* Botão de Sair no rodapé da Sidebar */}
        <button 
          onClick={() => auth.signOut()} 
          className="flex items-center gap-3 text-zinc-500 hover:text-red-400 transition-colors font-bold uppercase text-xs tracking-widest mt-auto pt-8 border-t border-zinc-800"
        >
          <LogOut className="w-5 h-5" /> Sair do Painel
        </button>
      </aside>

      {/* Conteúdo da Página */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}