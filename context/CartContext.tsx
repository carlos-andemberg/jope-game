"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Aqui é onde definimos o "DNA" do item. Adicionamos a categoria aqui!
export interface ItemCarrinho {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagemUrl?: string;
  categoria?: string; // Esta linha resolve o erro
}

interface CartContextType {
  itens: ItemCarrinho[];
  adicionarAoCarrinho: (produto: any) => void;
  diminuirQuantidade: (id: string) => void;
  removerDoCarrinho: (id: string) => void;
  limparCarrinho: () => void;
  totalItens: number;
  valorTotal: number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('jope-cart');
    if (savedCart) {
      setItens(JSON.parse(savedCart));
    }
    setIsLoaded(true);
  }, []);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('jope-cart', JSON.stringify(itens));
    }
  }, [itens, isLoaded]);

  const adicionarAoCarrinho = (produto: any) => {
    setItens(prevItens => {
      const itemExistente = prevItens.find(item => item.id === produto.id);
      if (itemExistente) {
        return prevItens.map(item =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...prevItens, { 
        id: produto.id, 
        nome: produto.nome, 
        preco: produto.preco, 
        quantidade: 1, 
        imagemUrl: produto.imagemUrl,
        categoria: produto.categoria // Passando a categoria para o carrinho
      }];
    });
  };

  const diminuirQuantidade = (id: string) => {
    setItens(prevItens => {
      return prevItens.map(item => {
        if (item.id === id) {
          return { ...item, quantidade: Math.max(1, item.quantidade - 1) };
        }
        return item;
      });
    });
  };

  const removerDoCarrinho = (id: string) => {
    setItens(prevItens => prevItens.filter(item => item.id !== id));
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  const totalItens = itens.reduce((total, item) => total + item.quantidade, 0);
  const valorTotal = itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);

  return (
    <CartContext.Provider value={{ 
      itens, 
      adicionarAoCarrinho, 
      diminuirQuantidade, 
      removerDoCarrinho, 
      limparCarrinho, 
      totalItens, 
      valorTotal,
      isLoaded 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};