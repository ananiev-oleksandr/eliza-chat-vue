<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

import type { Message } from '../../types/chat';
import ChatMessage from './ChatMessage/ChatMessage.vue';

const chatWindow = ref<HTMLElement | null>(null);
const props = defineProps<{
	messages: Message[];
}>();

const scrollToBottom = async () => {
	await nextTick();
	if (chatWindow.value) {
		chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
	}
};

watch(
	() => props.messages.length,
	() => {
		scrollToBottom();
	},
	{ flush: 'post' }
);
</script>
<template>
	<main class="chat-body" ref="chatWindow">
		<ul class="messages" aria-label="Chat messages">
			<ChatMessage v-for="message in props.messages" :key="message.id" :message="message" />
		</ul>
	</main>
</template>
<style scoped>
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
</style>
