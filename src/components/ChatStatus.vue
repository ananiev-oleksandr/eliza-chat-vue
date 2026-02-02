<script setup lang="ts">
import { computed } from 'vue';
import type { RequestStatus } from '../types/chat';

const props = defineProps<{
	status: RequestStatus;
}>();

const statusText = computed(() => {
	const labels: Record<RequestStatus, string> = {
		idle: 'Ready',
		pending: 'Sending...',
		error: 'Network error',
	};
	return labels[props.status];
});
</script>

<template>
	<div class="status">
		<span :class="['status__dot', `status--${status}`]"></span>
		<span class="status__text">{{ statusText }}</span>
	</div>
</template>

<style scoped>
.status {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 12px;
	color: var(--muted);
}

.status__dot {
	width: 8px;
	height: 8px;
	border-radius: 999px;
	background: rgba(80, 220, 140, 0.9);
	box-shadow: 0 0 0 3px rgba(80, 220, 140, 0.15);
}

.status--pending {
	background: rgba(194, 186, 177, 0.9);
}

.status--error {
	background: rgba(255, 149, 35, 0.9);
}
</style>
