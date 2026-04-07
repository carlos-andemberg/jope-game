"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { useNotification } from "@/context/NotificationContext";
import { 
  collection, query, orderBy, onSnapshot, 
  doc, increment, writeBatch 
} from "firebase/firestore";
import { 
  ShoppingBag, CheckCircle2, XCircle, RotateCcw, 
  X, Package, Trash2, ChevronRight, Plus, Search,
  AlertTriangle
} from "lucide-react";

export default function AdminPedidos() {
  const { notificar } = useNotification();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [produtosCatalogo, setProdutosCatalogo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<any>(null);
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const q = query(collection(db, "pedidos"), orderBy("criadoEm", "desc"));
    const unsubPedidos = onSnapshot(q, (snapshot) => {
      setPedidos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const unsubProdutos = onSnapshot(collection(db, "produtos"), (snapshot) => {
      setProdutosCatalogo(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubPedidos(); unsubProdutos(); };
  }, []);

  // AJUSTE DE QUANTIDADE COM SINCRONIA DE ESTOQUE
  const ajustarQuantidadeItem = async (produtoId: string, delta: number) => {
    if (!pedidoSelecionado || pedidoSelecionado.status !== 'Pendente') return;
    
    const itemNoPedido = pedidoSelecionado.itens.find((i: any) => i.id === produtoId);
    if (delta < 0 && itemNoPedido.quantidade <= 1) return; // Trava para não zerar/negativar via minus

    const batch = writeBatch(db);
    const infoProdutoLoja = produtosCatalogo.find(p => p.id === produtoId);

    if (delta > 0 && (!infoProdutoLoja || infoProdutoLoja.estoque <= 0)) {
      return notificar("Estoque insuficiente no catálogo!", "erro");
    }

    const novosItens = pedidoSelecionado.itens.map((item: any) => {
      if (item.id === produtoId) {
        return { ...item, quantidade: item.quantidade + delta };
      }
      return item;
    });

    const novoTotal = novosItens.reduce((acc: number, item: any) => acc + (item.precoUnitario * item.quantidade), 0);
    
    // Atualiza Loja e Pedido simultaneamente
    batch.update(doc(db, "produtos", produtoId), { estoque: increment(-delta) });
    batch.update(doc(db, "pedidos", pedidoSelecionado.id), { 
      itens: novosItens, 
      valorTotal: novoTotal 
    });

    try {
      await batch.commit();
      setPedidoSelecionado({ ...pedidoSelecionado, itens: novosItens, valorTotal: novoTotal });
    } catch (e) {
      notificar("Erro ao sincronizar estoque.", "erro");
    }
  };

  const adicionarItemDoCatalogo = async (produto: any) => {
    if (pedidoSelecionado.status !== 'Pendente') return;
    if (produto.estoque <= 0) return notificar("Produto sem estoque disponível!", "erro");

    const jaExiste = pedidoSelecionado.itens.find((i: any) => i.id === produto.id);
    if (jaExiste) return ajustarQuantidadeItem(produto.id, 1);

    const batch = writeBatch(db);
    const novosItens = [...pedidoSelecionado.itens, {
      id: produto.id,
      nome: produto.nome,
      quantidade: 1,
      precoUnitario: produto.preco,
      categoria: produto.categoria || "Geral"
    }];

    const novoTotal = novosItens.reduce((acc: number, item: any) => acc + (item.precoUnitario * item.quantidade), 0);

    batch.update(doc(db, "produtos", produto.id), { estoque: increment(-1) });
    batch.update(doc(db, "pedidos", pedidoSelecionado.id), { itens: novosItens, valorTotal: novoTotal });

    await batch.commit();
    setPedidoSelecionado({ ...pedidoSelecionado, itens: novosItens, valorTotal: novoTotal });
    notificar("Item adicionado ao pedido", "sucesso");
    setMostrarCatalogo(false);
  };

  const removerItemEStornarEstoque = async (produtoId: string, quantidade: number) => {
    const batch = writeBatch(db);
    const novosItens = pedidoSelecionado.itens.filter((i: any) => i.id !== produtoId);
    const novoTotal = novosItens.reduce((acc: number, item: any) => acc + (item.precoUnitario * item.quantidade), 0);

    batch.update(doc(db, "produtos", produtoId), { estoque: increment(quantidade) });
    batch.update(doc(db, "pedidos", pedidoSelecionado.id), { itens: novosItens, valorTotal: novoTotal });

    await batch.commit();
    setPedidoSelecionado({ ...pedidoSelecionado, itens: novosItens, valorTotal: novoTotal });
    notificar("Item removido e estoque devolvido", "info");
  };

  const alterarStatusPedido = async (novoStatus: string) => {
    const batch = writeBatch(db);
    const pedidoRef = doc(db, "pedidos", pedidoSelecionado.id);

    // Lógica de Devolução Única
    if ((novoStatus === "Cancelado" || novoStatus === "Devolvido") && !pedidoSelecionado.estoqueRestaurado) {
      pedidoSelecionado.itens.forEach((item: any) => {
        batch.update(doc(db, "produtos", item.id), { estoque: increment(item.quantidade) });
      });
      batch.update(pedidoRef, { estoqueRestaurado: true });
    }

    batch.update(pedidoRef, { status: novoStatus });
    await batch.commit();
    setPedidoSelecionado(null);
    notificar(`Pedido atualizado: ${novoStatus}`, "sucesso");
  };

  const filtrados = pedidos.filter(p => p.id.toLowerCase().includes(filtro.toLowerCase()));

  if (loading) return <div className="p-10 text-center font-black text-yellow-400 animate-pulse uppercase tracking-[0.3em]">Sincronizando Banco...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      
      {/* Cabeçalho de Vendas */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
            <ShoppingBag className="text-yellow-400" aria-hidden="true" /> Central de Vendas
          </h1>
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Gestão de Pedidos e Fluxo de Caixa</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" aria-hidden="true" />
          <input 
            type="text"
            placeholder="Protocolo..."
            aria-label="Filtrar pedidos por ID"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-yellow-400 w-full md:w-80 transition-all font-bold"
          />
        </div>
      </header>

      {/* Lista de Pedidos */}
      <div className="grid grid-cols-1 gap-4">
        {filtrados.map((pedido) => (
          <button 
            key={pedido.id} 
            onClick={() => setPedidoSelecionado(pedido)}
            aria-label={`Abrir detalhes do pedido ${pedido.id}`}
            className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6 hover:border-yellow-400/50 transition-all group shadow-xl active:scale-[0.99]"
          >
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className={`w-2 h-12 rounded-full ${
                pedido.status === 'Pendente' ? 'bg-yellow-500' : 
                pedido.status === 'Finalizado' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <div className="text-left">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">#{pedido.id.slice(0, 8).toUpperCase()}</span>
                <h3 className="text-white font-black text-lg uppercase tracking-tight leading-none mt-1">
                  {pedido.itens.length} {pedido.itens.length === 1 ? 'Produto' : 'Produtos'}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <p className="text-[10px] text-zinc-600 font-black uppercase mb-1">Valor Total</p>
                <span className="text-2xl font-black text-white tracking-tighter">R$ {pedido.valorTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:text-yellow-400 transition-colors" />
            </div>
          </button>
        ))}
      </div>

      {/* MODAL DE GESTÃO DO PEDIDO */}
      {pedidoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-md animate-in fade-in" role="dialog" aria-modal="true">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-3xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
              <div>
                <div className="flex items-center gap-3 mb-1">
                   <h2 className="text-xl font-black text-white uppercase tracking-widest">Ficha da Venda</h2>
                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                     pedidoSelecionado.status === 'Finalizado' ? 'border-green-500/20 text-green-500' : 
                     pedidoSelecionado.status === 'Pendente' ? 'border-yellow-500/20 text-yellow-500' : 'border-red-500/20 text-red-500'
                   }`}>
                     {pedidoSelecionado.status}
                   </span>
                </div>
                <p className="text-zinc-600 text-[10px] font-black uppercase">Protocolo: #{pedidoSelecionado.id.toUpperCase()}</p>
              </div>
              <button 
                onClick={() => {setPedidoSelecionado(null); setMostrarCatalogo(false);}} 
                aria-label="Fechar ficha"
                className="p-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-zinc-400 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Itens do Pedido */}
            <div className="p-8 overflow-y-auto flex-1 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Conteúdo do Pedido</h3>
                {pedidoSelecionado.status === 'Pendente' && (
                  <button 
                    onClick={() => setMostrarCatalogo(!mostrarCatalogo)}
                    className="bg-yellow-400 text-zinc-950 px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-yellow-300 transition-all"
                  >
                    {mostrarCatalogo ? "Fechar Lista" : "+ Adicionar Item"}
                  </button>
                )}
              </div>

              {/* Mini Catalogo para Adição */}
              {mostrarCatalogo && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-[32px] p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in zoom-in-95">
                  {produtosCatalogo.map(prod => (
                    <button 
                      key={prod.id} 
                      onClick={() => adicionarItemDoCatalogo(prod)}
                      aria-label={`Adicionar ${prod.nome} ao pedido`}
                      className="flex items-center gap-4 p-3 bg-zinc-900/50 hover:bg-zinc-900 rounded-2xl border border-transparent hover:border-zinc-800 text-left transition-all"
                    >
                      <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
                        {prod.imagemUrl ? <img src={prod.imagemUrl} alt="" className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-zinc-700" />}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white uppercase leading-tight">{prod.nome}</p>
                        <p className="text-[9px] text-zinc-500 font-black uppercase mt-1">Loja: {prod.estoque} un</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Lista Real de Itens */}
              <div className="space-y-3">
                {pedidoSelecionado.itens.map((item: any) => (
                  <div key={item.id} className="bg-zinc-950/40 p-5 rounded-3xl border border-zinc-800/50 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
                        <Package className="w-5 h-5 text-zinc-800" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-tight">{item.nome}</p>
                        <p className="text-[10px] text-zinc-600 font-black">UN: R$ {item.precoUnitario.toFixed(2).replace('.', ',')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {pedidoSelecionado.status === 'Pendente' ? (
                        <>
                          <div className="flex items-center bg-zinc-900 rounded-xl p-1 border border-zinc-800">
                            <button 
                              onClick={() => ajustarQuantidadeItem(item.id, -1)} 
                              aria-label={`Remover 1 de ${item.nome}`}
                              className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-black text-xs text-white" aria-live="polite">{item.quantidade}</span>
                            <button 
                              onClick={() => ajustarQuantidadeItem(item.id, 1)} 
                              aria-label={`Adicionar 1 de ${item.nome}`}
                              className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-green-500 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removerItemEStornarEstoque(item.id, item.quantidade)}
                            aria-label={`Excluir ${item.nome} e devolver estoque`}
                            className="p-2 text-zinc-800 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <div className="px-5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 font-black text-xs uppercase">
                          {item.quantidade} UNIDADES
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer de Ações do Modal */}
            <div className="p-8 bg-zinc-950 border-t border-zinc-800">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <span className="text-zinc-600 font-black uppercase text-[10px] tracking-widest block mb-1">Total do Pedido</span>
                  <span className="text-4xl font-black text-yellow-400 tracking-tighter">
                    R$ {pedidoSelecionado.valorTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                {pedidoSelecionado.estoqueRestaurado && (
                   <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-blue-400 text-[9px] font-black uppercase tracking-widest">
                     <RotateCcw className="w-3 h-3" /> Estoque Estornado
                   </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pedidoSelecionado.status === 'Pendente' ? (
                  <>
                    <button 
                      onClick={() => alterarStatusPedido("Finalizado")} 
                      className="bg-green-600 hover:bg-green-500 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Concluir Venda
                    </button>
                    <button 
                      onClick={() => alterarStatusPedido("Cancelado")} 
                      className="bg-zinc-800 hover:bg-red-600 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Cancelar Pedido
                    </button>
                  </>
                ) : (
                  <button 
                    disabled={pedidoSelecionado.estoqueRestaurado}
                    onClick={() => alterarStatusPedido("Devolvido")}
                    className={`col-span-1 sm:col-span-2 py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                      pedidoSelecionado.estoqueRestaurado 
                      ? "bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50" 
                      : "bg-orange-600 hover:bg-orange-500 text-white shadow-xl"
                    }`}
                  >
                    <RotateCcw className="w-5 h-5" /> 
                    {pedidoSelecionado.estoqueRestaurado ? "Devolução já processada" : "Registrar Devolução de Mercadoria"}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}