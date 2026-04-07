import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Importação dos nossos contextos globais
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";

// Configuração da fonte Inter (limpa e moderna, excelente para leitura)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JOPE GAME | O Paraíso dos Jogadores",
  description: "A melhor loja de eletrônicos e periféricos gamer de Rio Largo.",
  icons: {
    icon: "/favicon.ico", // Lembre-se de colocar seu ícone na pasta public
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased selection:bg-yellow-400 selection:text-zinc-950`}>
        
        {/* A ordem dos Providers importa: 
          Colocamos a Notificação por fora para que ela possa 
          sobrepor qualquer elemento visual do app, inclusive o carrinho.
        */}
        <NotificationProvider>
          <CartProvider>
            
            {/* Div principal que segura o layout. 
              O 'min-h-screen' garante que o fundo preto cubra tudo.
            */}
            <div className="min-h-screen flex flex-col relative overflow-x-hidden">
              
              {/* O conteúdo das páginas entra aqui */}
              {children}

            </div>

          </CartProvider>
        </NotificationProvider>

      </body>
    </html>
  );
}