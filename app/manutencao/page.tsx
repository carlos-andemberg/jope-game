"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { 
  ArrowLeft, 
  MessageCircle, 
  Monitor, 
  Settings, 
  Hash, 
  Activity, 
  MapPin
} from "lucide-react";

export default function ManutencaoPC() {
  const router = useRouter();
  const { notificar } = useNotification();
  
  const [defeito, setDefeito] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [sinalDeVida, setSinalDeVida] = useState<"Sim" | "Não" | null>(null);

  const enviarParaWhatsApp = () => {
    if (!defeito || !sinalDeVida) {
      return notificar("Preencha o defeito e o sinal de vida!", "erro");
    }

    const numeroWhatsApp = "5582999331536";
    let mensagem = `*MANUTENÇÃO JOPE GAME* 🛠️\n\n`;
    mensagem += `📝 *Defeito:* ${defeito}\n`;
    mensagem += `🔢 *Nº Série:* ${numeroSerie || "Não informado"}\n`;
    mensagem += `⚡ *Sinal de Vida:* ${sinalDeVida}\n\n`;
    mensagem += `_Gostaria de agendar a entrega do equipamento._`;

    const textoEncoded = encodeURIComponent(mensagem);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.assign(`whatsapp://send?phone=${numeroWhatsApp}&text=${textoEncoded}`);
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${numeroWhatsApp}&text=${textoEncoded}`, "_blank");
    }
  };

  const abrirMapa = () => {
    const endereco = "Tv. Bandeirantes II, 50 - Conj. Bandeirante, Rio Largo - AL, 57100-000";
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
    window.open(url, "_blank");
    notificar("Abrindo localização no GPS...", "info");
  };

  return (
    <main className="min-h-screen bg-zinc-950 p-6 pb-24 text-white font-sans selection:bg-yellow-400 selection:text-zinc-950">
      
      {/* Header */}
      <div className="max-w-2xl mx-auto flex items-center justify-between mb-12 mt-4">
        <button 
          onClick={() => router.back()} 
          className="text-zinc-600 hover:text-yellow-400 transition-all font-black flex items-center gap-2 uppercase text-[10px] tracking-[0.2em]"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-4 h-4" /> VOLTAR
        </button>
        <h1 className="text-2xl font-black text-center text-yellow-400 tracking-tighter italic uppercase">
          Manutenção <span className="text-white">em PC</span>
        </h1>
        <div className="w-10 hidden md:block" />
      </div>

      <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-[48px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 blur-[120px] opacity-5 pointer-events-none" />

        <div className="space-y-8">
          
          {/* Defeito */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <Settings className="w-3 h-3" /> Coloque o Defeito:
            </label>
            <textarea 
              value={defeito}
              onChange={(e) => setDefeito(e.target.value)}
              placeholder="Ex: PC liga mas não dá imagem..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-[24px] p-6 text-white focus:border-yellow-400 outline-none min-h-[140px] transition-all resize-none font-medium"
            />
          </div>

          {/* Nº Série */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <Hash className="w-3 h-3" /> Nº Série:
            </label>
            <input 
              type="text"
              value={numeroSerie}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setNumeroSerie(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl h-14 px-6 text-white focus:border-yellow-400 outline-none font-bold"
              placeholder="Opcional"
            />
          </div>

          {/* Sinal de Vida */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <Activity className="w-3 h-3" /> Dá sinal de vida?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setSinalDeVida("Sim")}
                className={`h-16 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border ${
                  sinalDeVida === "Sim" 
                  ? "bg-emerald-500 border-emerald-500 text-zinc-950 shadow-lg" 
                  : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                }`}
              >
                Sim
              </button>
              <button 
                onClick={() => setSinalDeVida("Não")}
                className={`h-16 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border ${
                  sinalDeVida === "Não" 
                  ? "bg-red-500 border-red-500 text-zinc-950 shadow-lg" 
                  : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                }`}
              >
                Não
              </button>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO: WHATSAPP E MAPA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50">
            <button 
              onClick={enviarParaWhatsApp}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-5 rounded-[28px] font-black uppercase text-[10px] tracking-[0.2em] transition-all flex justify-center items-center gap-3 shadow-xl active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              Solicitar Zap
            </button>

            <button 
              onClick={abrirMapa}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-5 rounded-[28px] font-black uppercase text-[10px] tracking-[0.2em] transition-all flex justify-center items-center gap-3 border border-zinc-700 active:scale-[0.98]"
            >
              <MapPin className="w-5 h-5 text-yellow-400" />
              Ver Endereço
            </button>
          </div>

          <p className="text-center text-[8px] text-zinc-600 font-black uppercase tracking-[0.2em]">
            TV. BANDEIRANTES II, 50 - RIO LARGO, AL
          </p>

        </div>
      </div>
    </main>
  );
}