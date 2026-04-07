"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNotification } from "@/context/NotificationContext"; // Sistema de Toast
import { db } from "@/lib/firebase"; 
import { collection, addDoc, serverTimestamp, writeBatch, doc, increment } from "firebase/firestore";
import { Package, Trash2, MessageCircle, ArrowLeft, Loader2, ChevronRight, Tag } from "lucide-react";

export default function Carrinho() {
  const router = useRouter();
  const { notificar } = useNotification();
  const [enviando, setEnviando] = useState(false);
  
  const { 
    itens, 
    adicionarAoCarrinho, 
    diminuirQuantidade, 
    removerDoCarrinho, 
    limparCarrinho, 
    totalItens, 
    valorTotal, 
    isLoaded 
  } = useCart();

  const finalizarPedidoWhatsApp = async () => {
    if (itens.length === 0 || enviando) return;

    setEnviando(true);

    try {
      const batch = writeBatch(db);

      // 1. Baixa o estoque no banco de dados
      itens.forEach((item) => {
        const produtoRef = doc(db, "produtos", item.id);
        batch.update(produtoRef, {
          estoque: increment(-item.quantidade)
        });
      });

      // 2. Cria o registro do pedido no Firestore
      const pedidoRef = await addDoc(collection(db, "pedidos"), {
        itens: itens.map(item => ({
          id: item.id,
          nome: item.nome,
          quantidade: item.quantidade,
          precoUnitario: item.preco,
          categoria: item.categoria || "Geral"
        })),
        valorTotal: valorTotal,
        status: "Pendente",
        estoqueRestaurado: false,
        criadoEm: serverTimestamp(),
      });

      await batch.commit();

      // 3. Montagem da Mensagem para o WhatsApp
      const numeroWhatsApp = "5582999331536";
      let mensagem = `*NOVO PEDIDO JOPE GAME* 🎮\n`;
      mensagem += `*Protocolo:* #${pedidoRef.id.slice(0, 5).toUpperCase()}\n`;
      mensagem += `----------------------------\n\n`;
      
      itens.forEach(item => {
        const precoUn = item.preco.toFixed(2).replace('.', ',');
        const subtotalItem = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
        mensagem += `✅ *${item.nome}*\n`;
        mensagem += `   ${item.quantidade} un x R$ ${precoUn}\n`;
        mensagem += `   Subtotal: *R$ ${subtotalItem}*\n\n`;
      });
      
      mensagem += `----------------------------\n`;
      mensagem += `*TOTAL DO PEDIDO: R$ ${valorTotal.toFixed(2).replace('.', ',')}*\n\n`;
      mensagem += `_Aguardando confirmação de pagamento._`;

      const textoEncoded = encodeURIComponent(mensagem);
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // 4. Disparo Inteligente (Cross-Device)
      if (isMobile) {
        // No celular usa o protocolo direto para não abrir página cinza
        const deepLink = `whatsapp://send?phone=${numeroWhatsApp}&text=${textoEncoded}`;
        window.location.assign(deepLink);
      } else {
        // No PC abre em nova aba do WhatsApp Web
        const urlWeb = `https://web.whatsapp.com/send?phone=${numeroWhatsApp}&text=${textoEncoded}`;
        window.open(urlWeb, "_blank");
      }
      
      // Limpa o carrinho e avisa o usuário
      limparCarrinho();
      notificar("Pedido enviado! Verifique seu WhatsApp.", "sucesso");
      
    } catch (error) {
      console.error("Erro no checkout:", error);
      notificar("Houve um erro ao processar o pedido. Tente novamente.", "erro");
    } finally {
      setEnviando(false);
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" aria-label="Sincronizando..." />
    </div>
  );

  return (
    <main className="min-h-screen bg-zinc-950 p-6 font-sans pb-24 text-white">
      
      {/* Header com Navegação Inteligente */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-12 mt-4">
        <button 
          onClick={() => router.back()} // Volta para a página de vendas correta
          className="text-zinc-500 hover:text-yellow-400 transition-colors font-black flex items-center gap-2 uppercase text-[10px] tracking-[0.2em]"
          aria-label="Voltar para a página anterior"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Continuar Comprando
        </button>
        <h1 className="text-2xl md:text-4xl font-black text-center text-yellow-400 tracking-tighter">
          SEU <span className="text-white">CARRINHO</span>
        </h1>
        <div className="hidden md:block w-32" aria-hidden="true"></div>
      </div>

      <div className="max-w-5xl mx-auto">
        {totalItens === 0 ? (
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[40px] p-16 flex flex-col items-center text-center mt-12 shadow-2xl">
            <div className="relative w-40 h-40 mb-8">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-[60px] opacity-10" aria-hidden="true"></div>
              <Image src="/Mascote.jpeg" alt="JOPE Game Mascote" fill className="object-cover rounded-full border-4 border-zinc-800 relative z-10 opacity-40 grayscale" />
            </div>
            <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-widest">Nada por aqui...</h2>
            <p className="text-zinc-500 text-sm mb-10 font-bold uppercase tracking-tight">Que tal adicionar alguns itens gamer?</p>
            <button 
              onClick={() => router.back()}
              className="bg-yellow-400 text-zinc-950 hover:bg-yellow-300 py-5 px-12 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-xl"
            >
              Explorar Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Lista de Itens */}
            <section className="lg:col-span-7 flex flex-col gap-5" aria-label="Produtos escolhidos">
              {itens.map((item) => (
                <article key={item.id} className="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:bg-zinc-900 shadow-lg group">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 shrink-0 overflow-hidden relative shadow-inner">
                      {item.imagemUrl ? (
                        <img src={item.imagemUrl} alt={item.nome} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-10 h-10 text-zinc-900" aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">
                        <Tag className="w-3 h-3" aria-hidden="true" /> {item.categoria || "Periférico"}
                      </div>
                      <h3 className="font-bold text-white text-lg leading-tight mb-2 uppercase tracking-tight">{item.nome}</h3>
                      <div className="text-zinc-400 text-sm font-medium">
                        R$ {item.preco.toFixed(2).replace('.', ',')} 
                        <span className="text-zinc-700 px-2">x</span> 
                        {item.quantidade} un
                      </div>
                      
                      <div className="flex items-center bg-zinc-950 rounded-xl border border-zinc-800 p-1 w-fit mt-4">
                        <button onClick={() => diminuirQuantidade(item.id)} aria-label="Remover 1" className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-red-500 font-black transition-colors">-</button>
                        <span className="w-8 text-center font-black text-xs text-white" aria-live="polite">{item.quantidade}</span>
                        <button onClick={() => adicionarAoCarrinho(item)} aria-label="Adicionar 1" className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-green-500 font-black transition-colors">+</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 border-zinc-800/50 pt-5 md:pt-0">
                    <div className="text-right">
                      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Subtotal</p>
                      <span className="font-black text-yellow-400 text-2xl tracking-tighter">
                        R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <button onClick={() => removerDoCarrinho(item.id)} aria-label={`Excluir ${item.nome}`} className="text-zinc-800 hover:text-red-500 p-2 transition-colors">
                      <Trash2 className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </section>

            {/* Resumo e Checkout */}
            <aside className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 h-fit sticky top-6 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 blur-[100px] opacity-5" aria-hidden="true"></div>
              
              <h2 className="text-xs font-black text-zinc-500 mb-8 uppercase tracking-[0.3em]">Resumo da Compra</h2>
              
              <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
                <span className="text-zinc-400 font-bold text-sm uppercase">Total de Itens</span>
                <span className="font-black text-white bg-zinc-800 px-4 py-1 rounded-full text-sm">{totalItens}</span>
              </div>

              <div className="mb-10">
                <span className="text-zinc-500 font-black uppercase text-[10px] mb-2 block tracking-widest">Valor Final a Pagar</span>
                <span className="text-4xl font-black text-yellow-400 tracking-tighter">
                  R$ {valorTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button 
                onClick={finalizarPedidoWhatsApp}
                disabled={enviando}
                aria-label="Finalizar compra e abrir WhatsApp"
                className={`w-full py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] transition-all flex justify-center items-center gap-3 active:scale-[0.98] group shadow-xl ${
                  enviando ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
                }`}
              >
                {enviando ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" /> 
                    FINALIZAR NO WHATSAPP
                    <ChevronRight className="w-4 h-4 opacity-30" aria-hidden="true" />
                  </>
                )}
              </button>
              
              <div className="mt-8 p-6 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 text-center">
                 <p className="text-[10px] text-zinc-600 leading-relaxed uppercase font-black tracking-tight italic">
                  O estoque é reservado assim que você clica em enviar. JOPE GAME preza pela sua experiência!
                </p>
              </div>
            </aside>

          </div>
        )}
      </div>
    </main>
  );
}