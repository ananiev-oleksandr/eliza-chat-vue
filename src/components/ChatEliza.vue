<script setup lang="ts">
import { useChat } from '../composables/useChat';
import ChatBody from './ChatBody/ChatBody.vue';
import ChatFooter from './ChatFooter/ChatFooter.vue';
import ChatHeader from './ChatHeader/ChatHeader.vue';

const { messages, requestStatus, isLoading, sendMessage, clearChat } = useChat();
</script>

<template>
	<div class="chat-card">
		<ChatHeader @clear="clearChat" />

		<ChatBody :messages="messages" />

		<ChatFooter :status="requestStatus" :loading="isLoading" @send="sendMessage" />
	</div>
</template>

<style scoped>
.chat-card {
	width: min(920px, 100%);
	height: min(720px, 92vh);
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 25%), var(--card);
	border: 1px solid var(--border);
	border-radius: var(--radius);
	box-shadow: var(--shadow);
	overflow: hidden;
	display: grid;
	grid-template-rows: auto 1fr auto;
}
</style>
