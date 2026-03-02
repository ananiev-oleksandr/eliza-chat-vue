<script setup lang="ts">
import type { RequestStatus } from '../../types/chat';
import ChatComposer from '../ChatFooter/ChatComposer/ChatComposer.vue';
import ChatStatus from '../ChatFooter/ChatStatus/ChatStatus.vue';

const props = defineProps<{
	status: RequestStatus;
	loading: boolean;
}>();

const emit = defineEmits<{
	send: [text: string];
}>();
</script>

<template>
	<footer class="chat-footer">
		<ChatComposer :loading="props.loading" @send="emit('send', $event)" />
		<ChatStatus :status="props.status" />
	</footer>
</template>

<style>
.chat-footer {
	padding: 14px 18px 18px;
	background: var(--card-2);
	border-top: 1px solid var(--border);
	display: grid;
	gap: 10px;
}
</style>
