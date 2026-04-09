# 🎮 JOPE GAME | O Paraíso dos Jogadores

> Plataforma de e-commerce e serviços focada em hardware, eletrônicos e periféricos gamers. Desenvolvida com foco extremo em performance, acessibilidade e experiência do usuário (Mobile-First).

🌐 **Acesso ao vivo:** [jopegame.com.br](https://jopegame.com.br)

---

## 🚀 Tecnologias e Stack

Este projeto foi construído utilizando as ferramentas mais modernas do ecossistema front-end:

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Linguagem:** TypeScript / React
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Gerenciamento de Estado:** React Context API (`CartContext`, `NotificationContext`)
* **Hospedagem & Deploy:** Netlify

---

## ⚡ Destaques de Performance e SEO

O projeto passou por rigorosas otimizações para atingir o topo das métricas do **Google PageSpeed Insights** (99+ Mobile / 100 Desktop):

* **Otimização de LCP (Largest Contentful Paint):** Imagens críticas carregadas via estratégia `priority` e `unoptimized` para contornar gargalos de Cold Start (Cache Frio) em provedores Serverless.
* **Aceleração de Hardware (GPU):** Filtros complexos (`blur`, `shadow`) transferidos para a placa de vídeo via `transform-gpu`, garantindo renderização fluida em dispositivos móveis menos potentes.
* **Route Groups:** Uso de `(pastas)` no Next.js App Router para URLs limpas (ex: `/eletronicos`) sem custo de performance de reescrita (Rewrites).
* **Open Graph Dinâmico:** Configuração de `metadataBase` para geração de previews perfeitos em compartilhamentos de redes sociais (WhatsApp, Instagram).

---

## 🛠️ Funcionalidades Principais

* **Catálogo de Produtos e Serviços:** Navegação dividida por nichos (Eletrônicos, Gamers, Serviços e Manutenção).
* **Carrinho de Compras Global:** Sistema de carrinho persistente e acessível de qualquer lugar da aplicação.
* **Sistema de Notificações Customizado:** Toasts interativos não-bloqueantes para feedback ao usuário.
* **Integração Direta via WhatsApp:** Geração de orçamentos e pedidos diretamente formatados para o WhatsApp da loja, com suporte avançado a Deep Linking.
* **Integração com Google Maps:** Botões de localização que abrem rotas automáticas para o endereço físico da loja.

---

## 💻 Como rodar localmente

1. Clone o repositório:
```bash
git clone https://github.com/carlos-andemberg/jope-game.git
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no seu navegador:
```text
http://localhost:3000
```

---

## 👨‍💻 Desenvolvedor

Projeto arquitetado e desenvolvido por **Carlos Andemberg**.

* 💼 **Portfólio:** [carlosandemberg.com.br](https://www.carlosandemberg.com.br)

---
*Projeto em constante evolução. Feedbacks são sempre bem-vindos!*