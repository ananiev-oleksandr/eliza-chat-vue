<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import ChatComposer from './components/ChatComposer.vue';
import ChatHeader from './components/ChatHeader.vue';
import ChatMessage from './components/ChatMessage.vue';
import ChatStatus from './components/ChatStatus.vue';
import { useChat } from './composables/useChat';

const { messages, requestStatus, isLoading, sendMessage, clearChat } = useChat();

const chatWindow = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
	await nextTick();
	if (chatWindow.value) {
		chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
	}
};

watch(messages, () => {
	scrollToBottom();
}, { deep: true });
</script>

<template>
	<div class="page">
		<div class="chat-card">
			<ChatHeader @clear="clearChat" />

			<main class="chat-body" ref="chatWindow">
				<ul class="messages" aria-label="Chat messages">
					<ChatMessage v-for="message in messages" :key="message.id" :message="message" />
				</ul>
			</main>

			<footer class="chat-footer">
				<ChatComposer :loading="isLoading" @send="sendMessage" />
				<ChatStatus :status="requestStatus" />
			</footer>
		</div>
	</div>
</template>

<style scoped>
.page {
	min-height: 100%;
	display: grid;
	place-items: center;
	padding: 24px;
}

.chat-card {
	width: min(920px, 100%);
	height: min(720px, 92vh);
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 25%),
		var(--card);
	border: 1px solid var(--border);
	border-radius: var(--radius);
	box-shadow: var(--shadow);
	overflow: hidden;
	display: grid;
	grid-template-rows: auto 1fr auto;
}

.chat-body {
	padding: 18px;
	overflow: auto;
}

.messages {
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	gap: 12px;
}

.chat-footer {
	padding: 14px 18px 18px;
	background: var(--card-2);
	border-top: 1px solid var(--border);
	display: grid;
	gap: 10px;
}
</style>
