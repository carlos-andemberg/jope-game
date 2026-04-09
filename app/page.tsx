import Image from "next/image";
import Link from "next/link";
import { Smartphone, Gamepad2, Settings, Wrench, Instagram, Phone } from "lucide-react";
import { Lock } from "lucide-react"; 

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center p-6 font-sans overflow-x-hidden">

      {/* Botão de Acesso Admin Oculto/Discreto */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-50">
        <Link
          href="/admin"
          className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 hover:border-yellow-400 text-zinc-600 hover:text-yellow-400 px-4 py-3 md:px-5 md:py-3 rounded-[20px] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl group"
          aria-label="Acessar painel de administração"
        >
          <Lock className="w-3 h-3 md:w-4 md:h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
          <span className="hidden sm:block">Painel Admin</span>
        </Link>
      </div>

      {/* Cabeçalho / Logo com Efeito Neon */}
      <div className="flex flex-col items-center mt-12 mb-12 relative">
        {/* Efeito Neon otimizado: Menor no mobile (blur-2xl), gigante no PC (md:blur-[80px]) e forçando GPU */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 bg-yellow-400 rounded-full blur-2xl md:blur-[80px] opacity-20 transform-gpu" aria-hidden="true"></div>

        <Image
          src="/Logo.jpeg"
          alt="JOPE GAME Logo"
          width={220}
          height={220}
          priority
          fetchPriority="high"
          unoptimized
          // Sombra padrão no mobile (shadow-lg), gigante no PC, e forçando GPU
          className="rounded-full border-4 border-zinc-800 shadow-lg md:shadow-[0_0_30px_rgba(250,204,21,0.2)] relative z-10 transform-gpu"
        />
      </div>

      {/* Botões de Navegação Modernos com Ícones Lucide */}
      <div className="flex flex-col gap-5 w-full max-w-md z-10">
        <Link
          href="/eletronicos"
          className="group relative flex items-center justify-between bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 hover:border-yellow-400 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(250,204,21,0.3)]"
        >
          <div className="flex items-center gap-4">
            <Smartphone className="w-8 h-8 text-zinc-500 group-hover:text-yellow-400 transition-colors duration-300" />
            <span className="text-white font-bold tracking-wide group-hover:text-yellow-400 transition-colors">VENDAS ELETRÔNICAS</span>
          </div>
          <span className="text-zinc-600 group-hover:text-yellow-400 transition-colors">&rarr;</span>
        </Link>

        <Link
          href="/gamers"
          className="group relative flex items-center justify-between bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 hover:border-yellow-400 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(250,204,21,0.3)]"
        >
          <div className="flex items-center gap-4">
            <Gamepad2 className="w-8 h-8 text-zinc-500 group-hover:text-yellow-400 transition-colors duration-300" />
            <span className="text-white font-bold tracking-wide group-hover:text-yellow-400 transition-colors">VENDAS GAMERS</span>
          </div>
          <span className="text-zinc-600 group-hover:text-yellow-400 transition-colors">&rarr;</span>
        </Link>

        <Link
          href="/servicos"
          className="group relative flex items-center justify-between bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 hover:border-yellow-400 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(250,204,21,0.3)]"
        >
          <div className="flex items-center gap-4">
            <Settings className="w-8 h-8 text-zinc-500 group-hover:text-yellow-400 transition-colors duration-300" />
            <span className="text-white font-bold tracking-wide group-hover:text-yellow-400 transition-colors">SERVIÇOS JOPE</span>
          </div>
          <span className="text-zinc-600 group-hover:text-yellow-400 transition-colors">&rarr;</span>
        </Link>

        <Link
          href="/manutencao"
          className="group relative flex items-center justify-between bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 hover:border-yellow-400 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(250,204,21,0.3)]"
        >
          <div className="flex items-center gap-4">
            <Wrench className="w-8 h-8 text-zinc-500 group-hover:text-yellow-400 transition-colors duration-300" />
            <span className="text-white font-bold tracking-wide group-hover:text-yellow-400 transition-colors">MANUTENÇÃO EM PC</span>
          </div>
          <span className="text-zinc-600 group-hover:text-yellow-400 transition-colors">&rarr;</span>
        </Link>
      </div>

      {/* Rodapé com Contatos */}
      {/* Rodapé com Contatos e Créditos */}
      <footer className="mt-auto pt-16 pb-8 text-center flex flex-col items-center gap-3 w-full">
        <h2 className="text-xl font-black text-yellow-400 tracking-widest mb-2">Contato</h2>

        <div className="flex flex-wrap justify-center gap-4">

          {/* Link do Instagram Exato */}
          <a
            href="https://www.instagram.com/jope5554/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 px-5 py-2.5 rounded-full border border-zinc-800 hover:border-yellow-400 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(250,204,21,0.15)] cursor-pointer"
          >
            <Instagram className="w-4 h-4 text-zinc-400 group-hover:text-yellow-400 group-hover:scale-110 transition-all duration-300" />
            <span className="font-mono text-sm text-zinc-300 group-hover:text-white transition-colors font-medium tracking-wide">
              JOPE 5554
            </span>
          </a>

          {/* Link do WhatsApp com mensagem pronta */}
          <a
            href="https://wa.me/5582999331536?text=Ol%C3%A1%21%20Vim%20da%20loja%20online%2C%20pode%20me%20ajudar%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 px-5 py-2.5 rounded-full border border-zinc-800 hover:border-yellow-400 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(250,204,21,0.15)] cursor-pointer"
          >
            <Phone className="w-4 h-4 text-zinc-400 group-hover:text-yellow-400 group-hover:scale-110 transition-all duration-300" />
            <span className="font-mono text-sm text-zinc-300 group-hover:text-white transition-colors font-medium tracking-wide">
              82 99933-1536
            </span>
          </a>

        </div>

        {/* Linha divisória sutil */}
        <div className="w-full max-w-xs h-px bg-zinc-800/60 mt-8 mb-4"></div>

        {/* Créditos do Desenvolvedor Carlos Andemberg */}
        <a
          href="https://www.carlosandemberg.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-1 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-yellow-400 transition-colors"
          aria-label="Portfólio do Desenvolvedor Carlos Andemberg"
        >
          <span>Desenvolvido por</span>
          <span className="text-zinc-400 group-hover:text-white transition-colors">
            Carlos Andemberg
          </span>
        </a>
      </footer>

    </main>
  );
}