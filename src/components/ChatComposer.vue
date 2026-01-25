<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
	loading: boolean
}>();

const emit = defineEmits<{
	send: [text: string]
}>();

const inputText = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const handleSend = () => {
	const text = inputText.value.trim();
	if (text && !props.loading) {
		emit('send', text);
		inputText.value = '';
		textareaRef.value?.focus();
	}
};

const handleKeydown = (e: KeyboardEvent) => {
	if (e.key === 'Enter' && !e.shiftKey) {
		e.preventDefault();
		handleSend();
	}
};

defineExpose({
	focus: () => textareaRef.value?.focus()
});
</script>

<template>
	<form @submit.prevent="handleSend" class="composer" aria-label="Message composer">
		<div class="composer__field">
			<label class="sr-only" for="message">Message</label>
			<textarea 
				v-model="inputText" 
				ref="textareaRef" 
				id="message" 
				class="input input--textarea"
				placeholder="Type your message…" 
				autocomplete="off" 
				@keydown="handleKeydown"
			></textarea>
			<div class="composer__hint">
				Enter — send • Shift+Enter — new line
			</div>
		</div>

		<button 
			:disabled="loading || !inputText.trim()"
			:class="[loading ? 'is-loading' : '', 'btn', 'btn--primary']" 
			type="submit"
		>
			<span class="btn__text">Send</span>
			<span class="btn__spinner" aria-hidden="true"></span>
		</button>
	</form>
</template>

<style scoped>
.composer {
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 12px;
	align-items: start;
}

.composer__field {
	display: grid;
	gap: 6px;
}

.input {
	width: 100%;
	height: 44px;
	padding: 0 12px;
	border-radius: var(--radius-sm);
	border: 1px solid var(--border);
	background: rgba(0, 0, 0, 0.18);
	color: var(--text);
	outline: none;
	font-family: inherit;
	font-size: 14px;
}

.input--textarea {
	height: 80px;
	padding: 12px;
	resize: none;
}

.input::placeholder {
	color: rgba(233, 236, 245, 0.42);
}

.input:focus {
	border-color: rgba(43, 108, 255, 0.45);
	box-shadow: 0 0 0 3px rgba(43, 108, 255, 0.15);
}

.composer__hint {
	font-size: 12px;
	color: var(--muted);
}
</style>
