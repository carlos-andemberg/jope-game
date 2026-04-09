import Link from "next/link";
import Image from "next/image";
import { Monitor, Mouse } from "lucide-react"; // Importação dos ícones

export default function VendasGamers() {
  return (
    <main className="min-h-screen bg-zinc-950 p-6 flex flex-col items-center font-sans overflow-x-hidden">

      <div className="w-full max-w-5xl flex items-center justify-between mb-8 mt-4">
        <Link href="/" className="text-zinc-400 hover:text-yellow-400 transition-colors font-bold flex items-center gap-2 uppercase text-sm tracking-widest">
          &larr; Voltar
        </Link>
        <h1 className="text-3xl font-black text-center text-yellow-400 tracking-wider">
          VENDAS GAMERS
        </h1>
        <div className="w-20"></div>
      </div>

      <div className="flex flex-col items-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-400 rounded-full blur-[60px] opacity-20"></div>

        <div className="relative w-32 h-32 mb-6">
          <Image
            src="/Mascote.jpeg"
            alt="Mascote JOPE"
            fill
            priority
            fetchPriority="high"
            unoptimized
            className="object-cover rounded-full border-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)] relative z-10"
          />
        </div>
        <p className="text-center text-zinc-300 text-lg font-medium max-w-md z-10">
          Seja bem-vindo ao PC.
        </p>
      </div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 justify-center px-4">

        <Link
          href="/gamers/orcamento"
          className="relative flex-1 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center overflow-hidden group hover:border-yellow-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(250,204,21,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="w-32 h-32 bg-zinc-950 rounded-2xl mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner border border-zinc-800/50">
            <Monitor className="w-16 h-16 text-zinc-500 drop-shadow-md group-hover:text-yellow-400 transition-colors" /> {/* Ícone Lucide */}
          </div>

          <h2 className="text-2xl font-black text-white mb-4 tracking-wide">PC GAMER</h2>

          <div className="inline-flex items-center justify-center w-full max-w-[200px] bg-yellow-400 text-zinc-950 py-3 rounded-full font-bold uppercase text-sm tracking-wider group-hover:bg-yellow-300 group-hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all">
            Fazer Orçamento
          </div>
        </Link>

        <Link
          href="/gamers/perifericos"
          className="relative flex-1 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center overflow-hidden group hover:border-yellow-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(250,204,21,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="w-32 h-32 bg-zinc-950 rounded-2xl mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner border border-zinc-800/50">
            <Mouse className="w-16 h-16 text-zinc-500 drop-shadow-md group-hover:text-yellow-400 transition-colors" /> {/* Ícone Lucide */}
          </div>

          <h2 className="text-2xl font-black text-white mb-4 tracking-wide">PERIFÉRICOS</h2>

          <div className="inline-flex items-center justify-center w-full max-w-[200px] bg-yellow-400 text-zinc-950 py-3 rounded-full font-bold uppercase text-sm tracking-wider group-hover:bg-yellow-300 group-hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all">
            Ver Produtos
          </div>
        </Link>

      </div>
    </main>
  );
}