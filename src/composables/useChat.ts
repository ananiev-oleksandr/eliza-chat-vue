import { computed, onMounted, ref, watch } from 'vue';
import { elizaClient } from '../api/eliza';
import type { Message, RequestStatus } from '../types/chat';

const STORAGE_KEY = 'eliza-chat-messages';

export function useChat() {
	const messages = ref<Message[]>([]);
	const requestStatus = ref<RequestStatus>('idle');
	const isLoading = computed(() => requestStatus.value === 'pending');

	onMounted(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				messages.value = parsed.map((m: Message) => ({
					...m,
					timestamp: new Date(m.timestamp)
				}));
			} catch {
				localStorage.removeItem(STORAGE_KEY);
			}
		}
	});

	watch(messages, (newMessages) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
	}, { deep: true });

	const sendMessage = async (text: string) => {
		if (!text.trim() || requestStatus.value === 'pending') return;

		const userMsg: Message = {
			id: Date.now().toString(),
			text: text.trim(),
			sender: 'user',
			timestamp: new Date()
		};
		
		messages.value.push(userMsg);
		requestStatus.value = 'pending';

		try {
			const response = await elizaClient.say({ sentence: text });
			requestStatus.value = 'idle';
			messages.value.push({
				id: (Date.now() + 1).toString(),
				text: response.sentence,
				sender: 'bot',
				timestamp: new Date()
			});
		} catch {
			requestStatus.value = 'error';
			messages.value.push({
				id: (Date.now() + 1).toString(),
				text: "Network error. Please try again.",
				sender: 'system',
				timestamp: new Date()
			});
		}
	};

	const clearChat = () => {
		if (messages.value.length === 0) return;
		if (window.confirm('Clear chat history?')) {
			messages.value = [];
		}
	};

	return {
		messages,
		requestStatus,
		isLoading,
		sendMessage,
		clearChat
	};
}
