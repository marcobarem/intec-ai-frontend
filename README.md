# Documentação Técnica: Frontend (Aplicação Conversacional para Análise de Dados de Postos de Combustível)

## 1. Introdução

Esta documentação detalha a arquitetura e a implementação da aplicação frontend construída para interagir com a API conversacional da Smartpetro. O objetivo é fornecer uma interface de usuário intuitiva e responsiva para gerentes de postos de combustível, permitindo que eles interajam com um chatbot de IA para consultas de dados operacionais em linguagem natural.

A aplicação foi desenvolvida utilizando **Next.js** com o **App Router**, aproveitando a renderização híbrida (Server Components e Client Components) para performance e SEO. O design é baseado na biblioteca de componentes **ShadCN UI** e utilitários do **Tailwind CSS**, garantindo um visual moderno e consistente. A gestão de estado e autenticação é feita com **React Query** e **NextAuth.js**, respectivamente, promovendo uma experiência de usuário fluida e segura.

## 2. Visão Geral da Arquitetura do Frontend

A arquitetura do frontend é projetada para ser modular, escalável e manter uma clara separação de preocupações, inspirada em princípios de "feature-sliced design" e componentes reutilizáveis.

### Tecnologias Chave:

- **Next.js (App Router):** Framework React para aplicações web de alto desempenho, oferecendo Server Components, Client Components, roteamento baseado em arquivos e otimizações de imagem e fontes.
- **React Query (TanStack Query):** Biblioteca para gerenciamento de estado de servidor (fetching, caching, sincronização e atualização de dados remotos), otimizando a performance e a experiência do usuário.
- **NextAuth.js:** Solução de autenticação completa para Next.js, gerenciando sessões JWT (JSON Web Tokens) e cookies de forma segura.
- **ShadCN UI:** Coleção de componentes UI construídos com Radix UI e estilizados com Tailwind CSS. Permite alta customização e reusabilidade.
- **Tailwind CSS:** Framework CSS "utility-first" para estilização rápida e eficiente, permitindo criar designs complexos diretamente no JSX.
- **Zod:** Biblioteca de validação de esquemas TypeScript-first, usada em conjunto com React Hook Form para validação de formulários.
- **React Hook Form:** Biblioteca para gerenciamento de formulários no React, otimizando performance e simplificando a lógica de validação e submissão.
- **Sonner:** Biblioteca de toasts (notificações) para feedback visual amigável ao usuário.
- **Axios:** Cliente HTTP baseado em Promises para fazer requisições à API backend.
- **Lucide React:** Biblioteca de ícones simples e consistentes, utilizados em toda a aplicação.

## 3. Estrutura de Pastas e Módulos

A organização do projeto frontend visa clareza e separação de responsabilidades, seguindo uma abordagem que agrupa código por funcionalidade (`features`) e por tipo (`components`, `lib`, `hooks`):

```
├── public/                      # Arquivos estáticos (imagens, favicons, logos)
├── src/
│   ├── app/                     # App Router do Next.js (rotas, layouts, pages)
│   │   ├── (auth)/              # Grupo de rotas para autenticação (/login, /register)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (main)/              # Grupo de rotas principais do aplicativo
│   │   │   ├── chat/
│   │   │   │   └── [[...chatId]]/ # Rota dinâmica para chats (/chat, /chat/new, /chat/:id)
│   │   │   │       └── page.tsx
│   │   │   └── page.tsx         # Página inicial (landing page)
│   │   ├── api/                 # Rotas de API do Next.js (para NextAuth.js)
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   ├── layout.tsx           # Layout principal da aplicação (provedores globais)
│   │   └── not-found.tsx        # Página 404 personalizada
│   ├── components/              # Componentes de UI reutilizáveis (agnósticos de funcionalidade)
│   │   └── ui/                  # Componentes gerados pela ShadCN UI (button, card, input, etc.)
│   ├── features/                # Agrupa código por funcionalidade específica (chat, auth, etc.)
│   │   └── chat/                # Tudo relacionado à funcionalidade de chat
│   │       ├── components/      # Componentes específicos do chat (chat-interface, chat-sidebar)
│   │       │   ├── chat-interface.tsx
│   │       │   └── chat-sidebar.tsx
│   │       ├── services/        # Funções para interagir com a API de chat (chat.service.ts)
│   │       │   └── chat.service.ts
│   │       └── types.ts         # Interfaces de dados para chat e mensagens
│   ├── hooks/                   # Hooks customizados reutilizáveis (useAuth)
│   │   └── use-auth.ts
│   ├── lib/                     # Bibliotecas e utilitários globais
│   │   ├── api/                 # Configuração do cliente HTTP (axios.ts)
│   │   │   └── axios.ts
│   │   ├── auth/                # Configuração e provedores de autenticação (NextAuth.js)
│   │   │   └── provider.tsx
│   │   ├── react-query/         # Configuração e provedor do React Query
│   │   │   └── provider.tsx
│   │   ├── utils.ts             # Funções utilitárias diversas (cn, etc.)
│   │   └── validators/          # Schemas de validação com Zod (auth.ts)
│   │       └── auth.ts
│   └── styles/                  # Estilos CSS globais (globals.css)
│       └── globals.css
├── middleware.ts                # Middleware do Next.js para proteção de rotas
├── next.config.mjs              # Configuração do Next.js
├── package.json                 # Dependências do projeto
├── tsconfig.json                # Configuração do TypeScript
└── tailwind.config.ts           # Configuração do Tailwind CSS
```

### Detalhes de Módulos e Componentes Chave:

- **`app/layout.tsx`**: O layout raiz da aplicação. É um Server Component que envolve toda a árvore de componentes com provedores essenciais:
  - `ReactQueryProvider`: Para o cache e gerenciamento de dados de servidor.
  - `AuthProvider`: Para o gerenciamento de sessão do NextAuth.js.
  - `TooltipProvider`: Para que os tooltips da ShadCN UI funcionem.
  - `Toaster`: Para exibir notificações (toasts) em toda a aplicação.
- **`middleware.ts`**: Implementa a lógica de proteção de rotas, redirecionando usuários não autenticados para a página de login e impedindo que usuários logados acessem rotas de autenticação.
- **`lib/api/axios.ts`**: Contém a função `createApiClient` que retorna uma instância configurada do Axios. É crucial para anexar o `access_token` JWT aos cabeçalhos `Authorization` em todas as requisições autenticadas, garantindo a segurança das chamadas à API backend.
- **`hooks/use-auth.ts`**: Um hook customizado que encapsula o `useSession` do NextAuth.js, fornecendo um acesso simplificado e tipado ao status de autenticação (`isAuthenticated`, `isLoading`) e aos dados do usuário (`user`, `accessToken`).
- **`features/chat/types.ts`**: Define as interfaces TypeScript para `BackendMessage`, `Message`, `BackendChat`, `Chat` e as interfaces de resposta da API (`GetChatsResponse`, `SendMessageApiResponse`), garantindo consistência entre o frontend e o backend (conforme a documentação Swagger).
- **`features/chat/services/chat.service.ts`**: Centraliza todas as chamadas HTTP relacionadas a chats e mensagens. Exporta `createChatService` que recebe o `accessToken` e retorna métodos como `getChats`, `getMessagesByChatId`, `sendMessageAndMaybeCreateChat`, `renameChat`, e `deleteChat`. Esta estrutura garante que o token seja injetado corretamente nas requisições.

## 4. Fluxos de Negócio Implementados no Frontend

### 4.1. Autenticação de Usuários

O frontend integra-se ao NextAuth.js para gerenciar o ciclo de vida da autenticação.

- **Página de Login (`/login` - `app/(auth)/login/page.tsx`):**
  - Formulário de login implementado com **React Hook Form** e validação de schema com **Zod**.
  - Ao submeter, chama `signIn("credentials", { ... })` do NextAuth.js, que delega a autenticação ao endpoint `/api/auth/[...nextauth]/route.ts` no backend.
  - Exibe feedback de sucesso/erro (`sonner` toasts) e redireciona para `/chat` em caso de sucesso.
  - Possui um botão "Voltar para a Home" e um link para a página de registro.
- **Página de Registro (`/register` - `app/(auth)/register/page.tsx`):**
  - Formulário de registro com **React Hook Form** e validação **Zod** (incluindo `name`, `email`, `password`, `cpf`, `phone` e confirmação de senha).
  - Ao submeter, faz uma requisição `POST` para `/auth/register` através da instância `api` do Axios.
  - Exibe feedback (toasts) e redireciona para `/login` em caso de sucesso.
- **Proteção de Rotas (`middleware.ts`):**
  - Todas as rotas são protegidas por padrão.
  - Rotas como `/login`, `/register`, `/` (landing page) e `/api/auth` são explicitamente públicas.
  - Usuários não autenticados são redirecionados para `/login` ao tentar acessar rotas protegidas.
  - Usuários autenticados que tentam acessar `/login` ou `/register` são redirecionados para `/`.

### 4.2. Interface Conversacional (Chatbot)

Esta é a funcionalidade central do aplicativo, permitindo a interação com a IA.

- **Layout Principal do Chat (`app/(main)/chat/[[...chatId]]/page.tsx`):**
  - É um Server Component que define a estrutura principal de duas colunas: a `ChatSidebar` (Client Component) e a área principal do `ChatInterface` (Client Component).
- **`ChatInterface` (`features/chat/components/chat-interface.tsx`):**

  - **Gerenciamento de Estado:** Utiliza `useState` para as mensagens exibidas, o input do usuário e o estado de digitação.
  - **Roteamento Dinâmico:** Usa `useParams` e `useRouter` para determinar o `chatId` da URL (`/chat`, `/chat/new`, `/chat/:id`) e navegar entre chats.
  - **Controle da Sidebar (Responsividade):** Gerencia o estado `isSidebarOpen` e uma função `setIsSidebarOpen` para controlar a visibilidade da `ChatSidebar` em dispositivos móveis (ativada por um botão de menu no cabeçalho do chat). Um overlay escuro (`fixed inset-0 bg-black/50`) é exibido quando a sidebar está aberta em mobile.
  - **Busca de Chats (`useQuery<Chat[], Error>`)**: Utiliza `chatService.getChats()` para buscar a lista de todos os chats do usuário. A query é habilitada (`enabled`) apenas quando o usuário está autenticado e o `chatService` está pronto.
  - **Busca de Mensagens (`useQuery<Message[], Error>`)**: Utiliza `chatService.getMessagesByChatId(activeChatId)` para buscar as mensagens do chat ativo. A query é habilitada apenas se um `activeChatId` existir e o usuário estiver autenticado.
  - **Criação/Envio de Mensagens (`useMutation`)**:
    - `sendMessageAndMaybeCreateChatMutation`: Uma única mutação que chama `chatService.sendMessageToAI(content, chatId)`.
    - **Lógica Inteligente:** No `mutationFn`, o `chatId` é passado para o backend. Se `activeChatId` for `null` (indicando um novo chat), o `chatId` não é incluído no corpo da requisição, e o backend é instruído pelo Swagger a criar um novo chat dinamicamente.
    - **Atualização Otimista:** A mensagem do usuário é adicionada ao estado local (`setMessages`) imediatamente após o envio (`handleSubmit`), proporcionando uma UX fluida.
    - **Tratamento `onSuccess`**:
      - Recebe a mensagem do usuário e da IA do backend.
      - Se um novo chat foi criado (`!activeChatId` no frontend e `userMessage.chatId` tem um ID real do backend), o `router.push()` redireciona para a URL do novo chat (`/chat/:newChatId`), atualizando o `activeChatId` na URL.
      - `queryClient.setQueryData()` atualiza o cache do React Query com as mensagens reais do backend, substituindo a mensagem otimista.
      - `queryClient.invalidateQueries({ queryKey: ["chats"] })` força a atualização da lista de chats na sidebar para exibir o novo chat ou a data de última atualização.
      - Exibe toasts de sucesso.
    - **Tratamento `onError`**: Exibe toasts de erro e logs no console.
  - **Renderização de Mensagens:**
    - Utiliza `ScrollArea` da ShadCN UI para a área de mensagens.
    - **Auto-scroll:** Um `ref` (`messagesEndRef`) e um `useEffect` com `scrollToBottom()` garantem que a tela role automaticamente para a última mensagem. O contêiner de mensagens usa `flex flex-col-reverse` e `justify-end min-h-full` para que a área de scroll sempre empurre o conteúdo para o fundo, e as mensagens são `reverse().map()` para que apareçam na ordem correta.
    - **Alinhamento Visual:** Mensagens do usuário usam `justify-end flex-row-reverse` para bolha à direita e avatar à direita. Mensagens do bot usam `justify-start` para bolha e avatar à esquerda. `items-start` ajuda a alinhar o conteúdo no topo.
    - **Avatares:** Exibem a primeira letra do nome do usuário ou um ícone `User` para o usuário, e o ícone `Bot` para o assistente.
    - **Indicador de Digitação:** Exibe um `Badge` "Pensando..." com animação de pontos enquanto uma requisição de mensagem está pendente.
  - **Formulário de Input:**
    - Campo de `Input` da ShadCN UI para digitar mensagens.
    - Botão `Send` para enviar.
    - Ambos são desabilitados durante o carregamento de autenticação, pendência de requisições ou se o `chatService` não estiver pronto.

- **`ChatSidebar` (`features/chat/components/chat-sidebar.tsx`):**
  - É um Client Component que recebe a lista de `chats`, o `activeChatId`, e funções de callback (`onSelectChat`, `onCreateNewChat`, `handleLogout`) como props do `ChatInterface`.
  - **Responsividade:** Controla sua visibilidade através da prop `isOpen` e a transição (`transition-transform`) para deslizar para dentro/fora da tela em mobile.
  - **Navegação:** Lista os chats recuperados por `useQuery` no `ChatInterface`.
  - **Ações de Chat (Renomear/Excluir):**
    - Cada item de chat tem um `DropdownMenu` com opções para "Renomear Chat" e "Excluir Chat" (botão `MoreVertical` visível no hover).
    - Usa `AlertDialog` para confirmações de exclusão e para a interface de renomear chat (com `Input` e `Label`).
    - As mutações `renameChatMutation` e `deleteChatMutation` chamam `chatService.renameChat()` e `chatService.deleteChat()`, invalidando o cache de chats após sucesso para atualizar a sidebar.
    - Em caso de exclusão do chat ativo, redireciona para `/chat/new`.
    - Chama a prop `onClose()` para fechar a sidebar em mobile após uma ação (renomear, excluir, selecionar chat).
  - **Loader/Erro:** Exibe `Loader2` durante o carregamento de chats ou mensagens, e mensagens de erro se a API falhar.

## 5. Endpoints da API Consumidos

O frontend interage com os seguintes endpoints da API backend (documentados no Swagger):

- **`POST /auth/login`**: Para autenticação de usuários.
- **`POST /auth/register`**: Para registro de novos usuários.
- **`GET /users/me`**: Para obter dados do usuário logado após a autenticação.
- **`GET /chats`**: Para listar todos os chats do usuário.
- **`GET /messages?chatId={id}`**: Para recuperar as mensagens de um chat específico.
- **`POST /messages/send`**: Para enviar uma mensagem ao chatbot, que pode criar um novo chat dinamicamente se o `chatId` não for fornecido.
- **`PATCH /chats/:id`**: Para renomear um chat existente.
- **`DELETE /chats/:id`**: Para excluir um chat.

## 6. Considerações Finais

O frontend foi desenvolvido com foco em uma experiência de usuário responsiva e intuitiva, seguindo as melhores práticas de desenvolvimento com Next.js, React Query e componentes ShadCN UI. A modularidade e a clareza na separação de preocupações garantem que a aplicação seja fácil de manter, estender e depurar. A integração com o backend via Axios autenticado e a manipulação inteligente do estado do chat proporcionam uma base sólida para futuras expansões e melhorias da plataforma Smartpetro.
