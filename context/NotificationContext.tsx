"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AlertOctagon, CheckCircle2, X, Info } from "lucide-react";

type TipoNotificacao = "erro" | "sucesso" | "info";

interface NotificationContextData {
  notificar: (mensagem: string, tipo?: TipoNotificacao) => void;
}

const NotificationContext = createContext<NotificationContextData | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [msg, setMsg] = useState("");
  const [tipo, setTipo] = useState<TipoNotificacao>("info");
  const [visivel, setVisivel] = useState(false);

  const notificar = (mensagem: string, tipoNotificacao: TipoNotificacao = "info") => {
    setMsg(mensagem);
    setTipo(tipoNotificacao);
    setVisivel(true);

    // Auto-fechar após 3 segundos
    setTimeout(() => setVisivel(false), 3000);
  };

  return (
    <NotificationContext.Provider value={{ notificar }}>
      {children}

      {/* COMPONENTE VISUAL DO TOAST */}
      {visivel && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[999] animate-in slide-in-from-top-5 duration-300 px-4 w-full max-w-md">
          <div className={`flex items-center gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md ${
            tipo === 'erro' ? 'bg-red-500/10 border-red-500/50 text-red-500' :
            tipo === 'sucesso' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' :
            'bg-blue-500/10 border-blue-500/50 text-blue-400'
          }`}>
            {tipo === 'erro' && <AlertOctagon className="w-5 h-5" />}
            {tipo === 'sucesso' && <CheckCircle2 className="w-5 h-5" />}
            {tipo === 'info' && <Info className="w-5 h-5" />}
            
            <span className="font-black uppercase text-[10px] tracking-widest flex-1">
              {msg}
            </span>

            <button onClick={() => setVisivel(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification deve ser usado dentro de um NotificationProvider");
  return context;
};