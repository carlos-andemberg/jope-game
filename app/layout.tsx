import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Importando os seus Contextos (Provedores)
import { NotificationProvider } from "@/context/NotificationContext";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JOPE GAME | O Paraíso dos Jogadores",
  description: "A melhor loja de eletrônicos e periféricos gamer.",
  // Configuração para o WhatsApp, Instagram e Facebook lerem a sua Logo
  openGraph: {
    title: "JOPE GAME | O Paraíso dos Jogadores",
    description: "A melhor loja de eletrônicos e periféricos gamer.",
    url: "https://jopegame.netlify.app",
    siteName: "JOPE GAME",
    images: [
      {
        url: "/Logo.jpeg", // Certifique-se de que a imagem está na pasta 'public'
        width: 800,
        height: 800,
        alt: "Logo JOPE GAME",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-zinc-950 text-white antialiased selection:bg-yellow-400 selection:text-zinc-950`}>
        {/* Envolvendo o app inteiro com os contextos */}
        <NotificationProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}