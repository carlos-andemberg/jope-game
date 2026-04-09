import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


import { NotificationProvider } from "@/context/NotificationContext";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  
  metadataBase: new URL("https://jopegame.com.br"),

  title: "JOPE GAME | O Paraíso dos Jogadores",
  description: "A melhor loja de eletrônicos e periféricos gamer.",
  openGraph: {
    title: "JOPE GAME | O Paraíso dos Jogadores",
    description: "A melhor loja de eletrônicos e periféricos gamer.",
    url: "https://jopegame.com.br",
    siteName: "JOPE GAME",
    images: [
      {
        url: "/og-image.jpeg", 
        width: 850,            
        height: 850,           
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
        
        <NotificationProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}