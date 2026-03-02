## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Installation

1. Clone the repository

```bash
git clone https://github.com/ananiev-oleksandr/eliza-chat-vue.git
cd eliza-chat-vue
```

2. Install dependencies

```bash
pnpm install
```

3. Run development server

```bash
pnpm dev
```

The app should be available at `http://localhost:5173`

### Build for Production

```bash
pnpm build
```

Output will be in the `dist/` directory.

### Linting & Formatting

```bash
pnpm lint          # ESLint check + auto-fix
pnpm format        # Prettier format
```

## ✨ What I Built

This project is my implementation of a chat interface that communicates with the Eliza bot via ConnectRPC. I focused on creating a clean, intuitive user experience while following modern Vue 3 best practices.

### Key Features

- 🎯 **Real-time messaging** with Eliza bot using ConnectRPC
- 💾 **Persistent chat history** stored in localStorage
- ⌨️ **Keyboard shortcuts** (Enter to send, Shift+Enter for new line)
- 🚦 **Loading states** and error handling
- 🕐 **Message timestamps** in HH:mm format
- 🧹 **Clear chat** functionality with confirmation

---

## 🛠️ Tech Stack

**Core:**

- Vue 3 (Composition API)
- TypeScript
- Vite

**API:**

- ConnectRPC (@connectrpc/connect)
- ConnectRPC Web (@connectrpc/connect-web)

**Code Quality:**

- ESLint
- Prettier

---

### Component Structure

```
src/
├── api/              # API clients and services
├── components/       # Vue components (single responsibility)
├── composables/      # Reusable composition functions
├── types/           # TypeScript interfaces and types
└── assets/          # Global styles
```
