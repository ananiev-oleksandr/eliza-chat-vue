# 💬 Chat Eliza

A modern, responsive chat application built with Vue 3 and TypeScript, featuring real-time communication with Eliza bot through ConnectRPC.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
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
- TypeScript (strict mode)
- Vite

**API:**
- ConnectRPC (@connectrpc/connect)
- ConnectRPC Web (@connectrpc/connect-web)

**Code Quality:**
- ESLint (flat config)
- Prettier
- TypeScript ESLint

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

I kept components small and focused. Each component does one thing well:
- `ChatHeader` - Title and actions
- `ChatMessage` - Individual message display
- `ChatComposer` - Message input and send
- `ChatStatus` - Connection status indicator


### Type Safety
All components use TypeScript with strict typing:
```typescript
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
}
```

Union types prevent invalid states at compile time.

---

## 💡 Implementation Highlights

### 1. Race Condition Prevention
```typescript
if (!text.trim() || requestStatus.value === 'pending') return;
```
The send function checks if a request is already in progress.

### 2. Automatic Scroll
```typescript
watch(messages, () => {
  scrollToBottom();
}, { deep: true });
```
Messages list auto-scrolls when new messages arrive.

### 3. Error Recovery
Network errors are caught and displayed as system messages, allowing users to retry without losing context.

### 4. Keyboard UX
```typescript
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};
```
Natural keyboard behavior: Enter sends, Shift+Enter adds new line.

---

## 🎯 What I Learned

Working on this project helped me:
- Master ConnectRPC integration in a browser environment
- Implement proper TypeScript patterns in Vue 3
- Handle async operations with proper error boundaries
- Build accessible UI components
- Structure a Vue 3 project for scalability

---

## 🔮 Future Improvements

If I had more time, I'd add:
- Typing indicator animation
- Message reactions
- Unit tests with Vitest
- E2E tests with Playwright
- Custom clear chat button
- Changed ID Generation from Date.now() to crypto.randomUUID()
- Improved Error Handling
- LocalStorage safety implementation
