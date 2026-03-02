import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { elizaClient } from '../api/eliza';
import type { Message, RequestStatus } from '../types/chat';

const STORAGE_KEY = 'eliza-chat-messages';
const MESSAGE_SENDERS = ['user', 'bot', 'system'] as const;

type StoredMessage = Omit<Message, 'timestamp'> & { timestamp: string };

const isStoredMessage = (value: unknown): value is StoredMessage => {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const item = value as Record<string, unknown>;

	return (
		typeof item.id === 'string' &&
		typeof item.text === 'string' &&
		typeof item.timestamp === 'string' &&
		typeof item.sender === 'string' &&
		MESSAGE_SENDERS.includes(item.sender as (typeof MESSAGE_SENDERS)[number])
	);
};

export function useChat() {
	const messages = ref<Message[]>([]);
	const requestStatus = ref<RequestStatus>('idle');
	const isLoading = computed(() => requestStatus.value === 'pending');

	onMounted(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.every(isStoredMessage)) {
					messages.value = parsed
						.map((m) => ({
							...m,
							timestamp: new Date(m.timestamp),
						}))
						.filter((m) => Number.isFinite(m.timestamp.getTime()));
				}
			} catch (error) {
				console.error('Failed to parse chat history:', error);
				localStorage.removeItem(STORAGE_KEY);
			}
		}
	});

	let saveTimeout: ReturnType<typeof setTimeout> | null = null;
	const saveToLocalStorage = (newMessages: Message[]) => {
		if (saveTimeout) {
			clearTimeout(saveTimeout);
		}

		saveTimeout = setTimeout(() => {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
			} catch (error) {
				console.error('Failed to save chat history:', error);
			}
			saveTimeout = null;
		}, 300);
	};

	watch(
		messages,
		(newMessages) => {
			saveToLocalStorage(newMessages);
		},
		{ deep: true }
	);

	onUnmounted(() => {
		if (saveTimeout) {
			clearTimeout(saveTimeout);
		}
	});

	const sendMessage = async (text: string) => {
		const trimmedText = text.trim();
		if (!trimmedText || requestStatus.value === 'pending') {
			return;
		}

		const userMsg: Message = {
			id: crypto.randomUUID(),
			text: trimmedText,
			sender: 'user',
			timestamp: new Date(),
		};

		messages.value.push(userMsg);
		requestStatus.value = 'pending';

		try {
			const response = await elizaClient.say({ sentence: trimmedText });
			requestStatus.value = 'idle';
			messages.value.push({
				id: crypto.randomUUID(),
				text: response.sentence,
				sender: 'bot',
				timestamp: new Date(),
			});
		} catch {
			requestStatus.value = 'error';
			messages.value.push({
				id: crypto.randomUUID(),
				text: 'Network error. Please try again.',
				sender: 'system',
				timestamp: new Date(),
			});
		}
	};

	const clearChat = () => {
		if (messages.value.length === 0) {
			return;
		}
		if (window.confirm('Clear chat history?')) {
			messages.value = [];
		}
	};

	return {
		messages,
		requestStatus,
		isLoading,
		sendMessage,
		clearChat,
	};
}
