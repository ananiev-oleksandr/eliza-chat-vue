<script setup lang="ts">
import { computed } from 'vue';

import type { Message } from '../../../types/chat';

const props = defineProps<{
	message: Message;
}>();

const locale = Intl.DateTimeFormat().resolvedOptions().locale || navigator.language || 'en-US';
const timeFormatter = new Intl.DateTimeFormat(locale, {
	hour: '2-digit',
	minute: '2-digit',
});

const senderLabel = computed(() => {
	if (props.message.sender === 'user') {
		return 'You';
	}
	if (props.message.sender === 'bot') {
		return 'Eliza';
	}
	return 'System';
});

const formattedTime = computed(() => timeFormatter.format(props.message.timestamp));
</script>

<template>
	<li :class="['msg', `msg--${props.message.sender}`]">
		<div class="msg__bubble">
			<div class="msg__meta">
				{{ senderLabel }}
				<template v-if="props.message.sender !== 'system'">
					• <span class="msg__time">{{ formattedTime }}</span>
				</template>
			</div>
			<div class="msg__text">{{ props.message.text }}</div>
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
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
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
