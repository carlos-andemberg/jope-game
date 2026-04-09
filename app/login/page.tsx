"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, ArrowRight, Home } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin"); // Se der certo, vai para o Dashboard
    } catch (err: any) {
      setError("E-mail ou senha incorretos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">

        {/* Logo e Título */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <Image
              src="/Logo.jpeg"
              alt="JOPE GAME"
              width={120}
              height={120}
              priority
              fetchPriority="high"
              unoptimized
              className="rounded-full border-4 border-zinc-800 relative z-10"
            />
          </div>
          <h1 className="text-3xl font-black text-yellow-400 tracking-widest uppercase">Acesso Admin</h1>
          <p className="text-zinc-500 mt-2 font-medium">Painel de controle JOPE GAME</p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Efeito de luz sutil no topo */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30"></div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">

            {/* Campo E-mail */}
            <div className="flex flex-col gap-2">
              <label className="text-zinc-400 text-xs font-black uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="flex flex-col gap-2">
              <label className="text-zinc-400 text-xs font-black uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-yellow-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-3 px-4 rounded-xl font-bold flex items-center gap-2">
                <span className="text-lg">⚠️</span> {error}
              </div>
            )}

            {/* Botão de Entrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-black py-4 rounded-2xl uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(250,204,21,0.4)] active:scale-95"
            >
              {loading ? "Autenticando..." : "Entrar no Painel"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>

        {/* Link para voltar à loja */}
        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-yellow-400 font-bold transition-colors uppercase text-xs tracking-widest">
            <Home className="w-4 h-4" /> Voltar para a Loja Online
          </Link>
        </div>

      </div>
    </main>
  );
}