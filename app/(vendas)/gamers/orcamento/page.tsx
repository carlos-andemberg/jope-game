"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Hammer, Wrench } from "lucide-react";

export default function OrcamentoEmConstrucao() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-white font-sans selection:bg-yellow-400 selection:text-zinc-950 overflow-hidden relative">
      
      {/* Brilho de Fundo Gamer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-yellow-400 blur-[150px] md:blur-[250px] opacity-10 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full">
        
        {/* Ícone Animado */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 rounded-full animate-pulse" aria-hidden="true" />
          <div className="w-24 h-24 md:w-32 md:h-32 bg-zinc-900 border border-zinc-800 rounded-[32px] md:rounded-[40px] flex items-center justify-center shadow-2xl relative">
            <Wrench className="w-10 h-10 md:w-14 md:h-14 text-yellow-400" aria-hidden="true" />
          </div>
        </div>

        {/* Textos Escalonados */}
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-xl">
          Área em <span className="text-yellow-400 italic">Forja</span>
        </h1>
        
        <p className="text-zinc-500 font-bold uppercase text-[10px] md:text-sm tracking-widest md:tracking-[0.2em] mb-12 max-w-md leading-relaxed">
          Estamos programando esta funcionalidade. Em breve, um sistema completo de orçamentos para o seu setup gamer estará disponível.
        </p>

        {/* Botão de Retorno */}
        <button
          onClick={() => router.back()}
          className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-yellow-400/50 text-white py-5 px-10 md:py-6 md:px-12 rounded-[28px] md:rounded-[32px] font-black uppercase text-[10px] md:text-xs tracking-[0.3em] transition-all flex items-center gap-3 shadow-xl active:scale-95 group"
          aria-label="Voltar para a página anterior"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 group-hover:-translate-x-1 transition-transform" />
          Voltar a Navegar
        </button>

      </div>

      {/* Marca D'água no Rodapé */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-[8px] md:text-[10px] text-zinc-700 font-black uppercase tracking-[0.4em]">
          JOPE GAME - UPDATE EM PROGRESSO
        </p>
      </div>

    </main>
  );
}