"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { useNotification } from "@/context/NotificationContext";
import { 
  collection, addDoc, onSnapshot, doc, deleteDoc, 
  updateDoc, serverTimestamp, query, orderBy, increment 
} from "firebase/firestore";
import { 
  Plus, Minus, PackagePlus, Trash2, Search, 
  Edit3, X, Image as ImageIcon, Tag, Package, UploadCloud
} from "lucide-react";

export default function AdminProdutos() {
  const { notificar } = useNotification();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");

  const [form, setForm] = useState({
    nome: '',
    preco: '0',
    estoque: 0,
    categoria: 'Eletrônicos',
    imagemUrl: ''
  });

  useEffect(() => {
    const q = query(collection(db, "produtos"), orderBy("criadoEm", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProdutos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setForm({ nome: '', preco: '0', estoque: 0, categoria: 'Eletrônicos', imagemUrl: '' });
    setEditandoId(null);
    setMostrarModal(false);
  };

  const salvarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Garantia absoluta de valor positivo
      let precoLimpo = Math.abs(parseFloat(form.preco.toString().replace(',', '.')) || 0);

      const dados = {
        ...form,
        preco: precoLimpo,
        estoque: Math.max(0, Number(form.estoque)),
        atualizadoEm: serverTimestamp()
      };

      if (editandoId) {
        await updateDoc(doc(db, "produtos", editandoId), dados);
        notificar("Produto atualizado!", "sucesso");
      } else {
        await addDoc(collection(db, "produtos"), { ...dados, criadoEm: serverTimestamp() });
        notificar("Cadastrado com sucesso!", "sucesso");
      }
      resetForm();
    } catch (error) {
      notificar("Erro ao salvar dados.", "erro");
    }
  };

  const iniciarEdicao = (produto: any) => {
    setForm({
      nome: produto.nome,
      preco: produto.preco.toString(),
      estoque: produto.estoque,
      categoria: produto.categoria,
      imagemUrl: produto.imagemUrl || ''
    });
    setEditandoId(produto.id);
    setMostrarModal(true);
  };

  const ajustarEstoqueRapido = async (id: string, delta: number) => {
    const p = produtos.find(item => item.id === id);
    if (delta < 0 && p.estoque <= 0) return;
    try {
      await updateDoc(doc(db, "produtos", id), { estoque: increment(delta) });
    } catch (e) {
      notificar("Erro no estoque.", "erro");
    }
  };

  const excluirProduto = async (id: string) => {
    if (confirm("Confirmar exclusão definitiva?")) {
      try {
        await deleteDoc(doc(db, "produtos", id));
        notificar("Item removido.", "sucesso");
      } catch (e) {
        notificar("Erro ao excluir.", "erro");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      
      {/* Cabeçalho */}
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 mt-10">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
            <Package className="text-yellow-400 w-10 h-10" aria-hidden="true" /> ESTOQUE <span className="text-zinc-800">ADMIN</span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" aria-hidden="true" />
            <input 
              type="text"
              placeholder="Buscar..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl h-14 pl-12 pr-6 text-sm text-white focus:border-yellow-400 outline-none w-full font-bold"
            />
          </div>
          <button 
            onClick={() => setMostrarModal(true)}
            className="bg-yellow-400 text-zinc-950 px-8 h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> NOVO PRODUTO
          </button>
        </div>
      </header>

      {/* Lista de Itens */}
      <div className="grid gap-4">
        {produtos.filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase())).map((produto) => (
          <div key={produto.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-20 h-20 bg-zinc-950 rounded-[28px] border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                {produto.imagemUrl ? <img src={produto.imagemUrl} alt={produto.nome} className="w-full h-full object-cover" /> : <ImageIcon className="text-zinc-800 w-8 h-8" />}
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{produto.categoria}</p>
                <h3 className="text-white font-black text-xl uppercase tracking-tighter leading-none">{produto.nome}</h3>
                <p className="text-yellow-400 font-black text-sm mt-1">R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-zinc-800 pt-5 md:pt-0">
              <div className="flex items-center bg-zinc-950 rounded-2xl p-1 border border-zinc-800 shadow-inner">
                <button onClick={() => ajustarEstoqueRapido(produto.id, -1)} aria-label="Diminuir" className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:text-red-500"><Minus className="w-4 h-4"/></button>
                <span className="w-10 text-center font-black text-sm text-white">{produto.estoque}</span>
                <button onClick={() => ajustarEstoqueRapido(produto.id, 1)} aria-label="Aumentar" className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:text-green-500"><Plus className="w-4 h-4"/></button>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => iniciarEdicao(produto)} aria-label="Editar" className="p-4 bg-zinc-800 text-zinc-400 hover:text-yellow-400 rounded-2xl transition-all"><Edit3 className="w-5 h-5"/></button>
                <button onClick={() => excluirProduto(produto.id)} aria-label="Excluir" className="p-4 bg-zinc-800 text-zinc-400 hover:text-red-500 rounded-2xl transition-all"><Trash2 className="w-5 h-5"/></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
              <h2 className="text-xl font-black text-white uppercase tracking-widest">{editandoId ? "Editar Item" : "Novo Cadastro"}</h2>
              <button onClick={resetForm} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-zinc-400 transition-all active:scale-90" aria-label="Fechar"><X /></button>
            </div>

            <form onSubmit={salvarProduto} className="p-8 space-y-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nome do Produto</label>
                <input 
                  required
                  value={form.nome}
                  onChange={e => setForm({...form, nome: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl h-14 px-8 text-white focus:border-yellow-400 outline-none font-bold"
                  placeholder="Ex: Mouse Gamer Razer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* PREÇO: Com R$ Brasileiro */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Preço Sugerido</label>
                  <div className="relative group h-14">
                    <span 
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-700 group-focus-within:text-yellow-400 transition-colors pointer-events-none" 
                      aria-hidden="true"
                    >
                      R$
                    </span>
                    <input 
                      required
                      type="text"
                      value={form.preco}
                      onFocus={(e) => e.target.select()}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9.,]/g, '');
                        setForm({...form, preco: val});
                      }}
                      className="w-full h-full bg-zinc-950 border border-zinc-800 rounded-3xl pl-14 pr-8 text-white focus:border-yellow-400 outline-none font-black"
                    />
                  </div>
                </div>

                {/* ESTOQUE: Grid fixo para Desktop e Mobile */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estoque Atual</label>
                  <div className="grid grid-cols-[56px_1fr_56px] h-14 bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden focus-within:border-yellow-400 transition-all">
                    <button 
                      type="button" 
                      onClick={() => setForm(f => ({...f, estoque: Math.max(0, f.estoque - 1)}))}
                      aria-label="Diminuir"
                      className="h-full flex items-center justify-center text-zinc-600 hover:text-red-500 hover:bg-zinc-900 transition-all"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <input 
                      type="number"
                      value={form.estoque}
                      onFocus={(e) => e.target.select()}
                      onChange={e => setForm({...form, estoque: Math.max(0, parseInt(e.target.value) || 0)})}
                      className="w-full bg-transparent text-center text-white font-black outline-none border-none focus:ring-0 appearance-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => setForm(f => ({...f, estoque: f.estoque + 1}))}
                      aria-label="Aumentar"
                      className="h-full flex items-center justify-center text-zinc-600 hover:text-green-500 hover:bg-zinc-900 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Categoria</label>
                <select 
                  value={form.categoria}
                  onChange={e => setForm({...form, categoria: e.target.value})}
                  className="w-full h-14 bg-zinc-950 border border-zinc-800 rounded-3xl px-8 text-white focus:border-yellow-400 outline-none font-bold appearance-none cursor-pointer"
                >
                  <option value="Eletrônicos">Eletrônicos</option>
                  <option value="Periféricos">Periféricos</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic underline decoration-yellow-400/30">URL da Imagem</label>
                  <a 
                    href="https://postimages.org/" target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 border border-zinc-700"
                  >
                    <UploadCloud className="w-3 h-3 text-yellow-400" /> Abrir Postimg
                  </a>
                </div>
                <input 
                  value={form.imagemUrl}
                  onChange={e => setForm({...form, imagemUrl: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl h-14 px-8 text-white focus:border-yellow-400 outline-none font-bold text-xs"
                  placeholder="https://i.postimg.cc/..."
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-yellow-400 text-zinc-950 h-16 rounded-[32px] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-yellow-300 transition-all mt-4 active:scale-[0.97]"
              >
                {editandoId ? "Atualizar Banco" : "Gravar Agora"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}