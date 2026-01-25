<script setup lang="ts">
import type { Message } from '../types/chat';

defineProps<{
	message: Message
}>();

const formatTime = (date: Date): string => {
	return new Intl.DateTimeFormat('uk-UA', {
		hour: '2-digit',
		minute: '2-digit'
	}).format(date);
};

const getSenderLabel = (sender: Message['sender']): string => {
	if (sender === 'user') return 'You';
	if (sender === 'bot') return 'Eliza';
	return 'System';
};
</script>

<template>
	<li :class="['msg', `msg--${message.sender}`]">
		<div class="msg__bubble">
			<div class="msg__meta">
				{{ getSenderLabel(message.sender) }}
				<template v-if="message.sender !== 'system'">
					• <span class="msg__time">{{ formatTime(message.timestamp) }}</span>
				</template>
			</div>
			<div class="msg__text">{{ message.text }}</div>
		</div>
	</li>
</template>

<style scoped>
.msg {
	display: flex;
}

.msg--user {
	justify-content: flex-end;
}

.msg--bot {
	justify-content: flex-start;
}

.msg--system {
	justify-content: center;
}

.msg__bubble {
	max-width: min(72ch, 78%);
	border-radius: var(--radius);
	padding: 12px 14px;
	border: 1px solid var(--border);
	background: var(--bot);
}

.msg--user .msg__bubble {
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
		rgba(43, 108, 255, 0.22);
	border-color: rgba(43, 108, 255, 0.35);
}

.msg--system .msg__bubble {
	max-width: min(80ch, 90%);
	background: var(--system);
	border-color: rgba(255, 170, 0, 0.25);
}

.msg__meta {
	font-size: 12px;
	color: var(--muted);
	display: flex;
	gap: 8px;
	align-items: center;
	margin-bottom: 6px;
}

.msg__time {
	opacity: 0.85;
}

.msg__text {
	font-size: 14px;
	line-height: 1.45;
	white-space: pre-wrap;
	word-break: break-word;
}
</style>
