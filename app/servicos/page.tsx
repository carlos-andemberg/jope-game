import Link from "next/link";
import { ArrowLeft, MapPin, Printer, Unlock, Disc3, Gamepad2, MonitorPlay, Music } from "lucide-react";

export default function Servicos() {
  const servicosLista = [
    { nome: "Impressões em Geral", icone: <Printer className="w-8 h-8 text-yellow-400" /> },
    { nome: "Desbloqueio de PS3 e Xbox 360", icone: <Unlock className="w-8 h-8 text-yellow-400" /> },
    { nome: "Jogos no OPL PS2", icone: <Disc3 className="w-8 h-8 text-yellow-400" /> },
    { nome: "Jogos no Exploit Xbox 360", icone: <Gamepad2 className="w-8 h-8 text-yellow-400" /> },
    { nome: "Jogos em Lojas no PS3", icone: <MonitorPlay className="w-8 h-8 text-yellow-400" /> },
    { nome: "Músicas no Pendrive", icone: <Music className="w-8 h-8 text-yellow-400" /> },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 p-6 font-sans pb-20">
      
      {/* Cabeçalho */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8 mt-4">
        <Link href="/" className="text-zinc-500 hover:text-yellow-400 transition-colors font-bold flex items-center gap-2 uppercase text-sm tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-2xl md:text-3xl font-black text-center text-yellow-400 tracking-wider">
          SERVIÇOS JOPE
        </h1>
        <div className="w-24"></div>
      </div>

      <p className="text-center text-zinc-400 mb-12 text-lg">
        Faça seu serviço com a gente
      </p>

      {/* Grid de Serviços */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {servicosLista.map((servico, index) => (
          <div key={index} className="flex items-center gap-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-colors group">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 group-hover:scale-110 transition-transform">
              {servico.icone}
            </div>
            <h2 className="text-lg font-bold text-zinc-200">{servico.nome}</h2>
          </div>
        ))}
      </div>

      {/* Localização / Mapa */}
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
        {/* Efeito de brilho ao fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-yellow-400 blur-[100px] opacity-5"></div>
        
        <MapPin className="w-12 h-12 text-yellow-400 mb-4 relative z-10" />
        <h2 className="text-2xl font-black text-white mb-2 relative z-10">Onde nos encontrar</h2>
        <p className="text-zinc-400 max-w-md mb-6 relative z-10 text-lg">
          Tv. Bandeirantes II, 50 - Conj. Bandeirante<br />
          Rio Largo - AL, 57100-000
        </p>

        <a 
          href="https://maps.google.com/?q=Tv.+Bandeirantes+II,+50+-+Conj.+Bandeirante,+Rio+Largo+-+AL,+57100-000" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-yellow-400 hover:bg-yellow-300 text-zinc-950 py-3 px-8 rounded-full font-bold uppercase tracking-widest transition-colors relative z-10 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
        >
          Ver no Mapa
        </a>
      </div>

    </main>
  );
}