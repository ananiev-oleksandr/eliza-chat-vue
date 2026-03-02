// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, nextTick } from 'vue';

import { elizaClient } from '../../api/eliza';
import { useChat } from '../useChat';

// Mock API
vi.mock('../../api/eliza', () => ({
	elizaClient: {
		say: vi.fn(),
	},
}));

type UseChatResult = ReturnType<typeof useChat>;

const mountUseChat = async () => {
	let chat!: UseChatResult;
	const root = document.createElement('div');

	const app = createApp({
		setup() {
			chat = useChat();
			return () => null;
		},
	});

	app.mount(root);
	await nextTick();

	return {
		...chat,
		unmount: () => {
			app.unmount();
			root.remove();
		},
	};
};

describe('useChat', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
		vi.useRealTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it('has correct initial structure', async () => {
		const { messages, requestStatus, isLoading, sendMessage, clearChat, unmount } =
			await mountUseChat();

		expect(messages.value).toEqual([]);
		expect(requestStatus.value).toBe('idle');
		expect(isLoading.value).toBe(false);
		expect(typeof sendMessage).toBe('function');
		expect(typeof clearChat).toBe('function');

		unmount();
	});

	it('hydrates messages from localStorage on mount', async () => {
		localStorage.setItem(
			'eliza-chat-messages',
			JSON.stringify([
				{
					id: '1',
					text: 'saved message',
					sender: 'user',
					timestamp: new Date('2026-01-01T10:00:00.000Z').toISOString(),
				},
			])
		);

		const { messages, unmount } = await mountUseChat();

		expect(messages.value).toHaveLength(1);
		expect(messages.value[0]?.text).toBe('saved message');
		expect(messages.value[0]?.timestamp).toBeInstanceOf(Date);

		unmount();
	});

	it('ignores malformed localStorage payload without crashing', async () => {
		localStorage.setItem('eliza-chat-messages', '{broken-json}');

		const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const { messages, unmount } = await mountUseChat();

		expect(messages.value).toEqual([]);
		expect(removeItemSpy).toHaveBeenCalledWith('eliza-chat-messages');
		expect(consoleErrorSpy).toHaveBeenCalled();

		unmount();
	});

	it('sendMessage adds user message', async () => {
		vi.mocked(elizaClient.say).mockResolvedValue({
			sentence: 'Hi!',
			$typeName: 'connectrpc.eliza.v1.SayResponse',
		});

		const { messages, sendMessage, unmount } = await mountUseChat();

		await sendMessage('test message');

		expect(messages.value.length).toBe(2);
		expect(messages.value[0]?.text).toBe('test message');
		expect(messages.value[0]?.sender).toBe('user');

		unmount();
	});

	it('sendMessage adds bot response', async () => {
		vi.mocked(elizaClient.say).mockResolvedValue({
			sentence: 'Response from Eliza',
			$typeName: 'connectrpc.eliza.v1.SayResponse',
		});

		const { messages, sendMessage, unmount } = await mountUseChat();

		await sendMessage('Hello');

		expect(messages.value[1]?.text).toBe('Response from Eliza');
		expect(messages.value[1]?.sender).toBe('bot');

		unmount();
	});

	it('requestStatus changes to idle after successful request', async () => {
		vi.mocked(elizaClient.say).mockResolvedValue({
			sentence: 'OK',
			$typeName: 'connectrpc.eliza.v1.SayResponse',
		});

		const { requestStatus, sendMessage, unmount } = await mountUseChat();

		await sendMessage('test');

		expect(requestStatus.value).toBe('idle');

		unmount();
	});

	it('adds system message on error', async () => {
		vi.mocked(elizaClient.say).mockRejectedValue(new Error('Network error'));

		const { messages, sendMessage, requestStatus, unmount } = await mountUseChat();

		await sendMessage('test');

		expect(requestStatus.value).toBe('error');
		expect(messages.value[1]?.sender).toBe('system');
		expect(messages.value[1]?.text).toBe('Network error. Please try again.');

		unmount();
	});

	it('does not send empty messages', async () => {
		const { messages, sendMessage, unmount } = await mountUseChat();

		await sendMessage('');
		await sendMessage('   ');

		expect(messages.value.length).toBe(0);
		expect(elizaClient.say).not.toHaveBeenCalled();

		unmount();
	});

	it('clearChat clears messages', async () => {
		vi.mocked(elizaClient.say).mockResolvedValue({
			sentence: 'OK',
			$typeName: 'connectrpc.eliza.v1.SayResponse',
		});
		vi.spyOn(window, 'confirm').mockReturnValue(true);

		const { messages, sendMessage, clearChat, unmount } = await mountUseChat();

		await sendMessage('test');
		expect(messages.value.length).toBe(2);

		clearChat();

		expect(messages.value.length).toBe(0);

		unmount();
	});

	it('does not clear messages when confirmation is cancelled', async () => {
		vi.mocked(elizaClient.say).mockResolvedValue({
			sentence: 'OK',
			$typeName: 'connectrpc.eliza.v1.SayResponse',
		});
		vi.spyOn(window, 'confirm').mockReturnValue(false);

		const { messages, sendMessage, clearChat, unmount } = await mountUseChat();

		await sendMessage('test');
		expect(messages.value.length).toBe(2);

		clearChat();
		expect(messages.value.length).toBe(2);

		unmount();
	});

	it('debounces localStorage writes', async () => {
		vi.useFakeTimers();
		vi.mocked(elizaClient.say).mockResolvedValue({
			sentence: 'OK',
			$typeName: 'connectrpc.eliza.v1.SayResponse',
		});

		const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
		const { sendMessage, unmount } = await mountUseChat();

		await sendMessage('one');
		await sendMessage('two');

		expect(setItemSpy).not.toHaveBeenCalled();

		vi.advanceTimersByTime(300);
		await nextTick();

		expect(setItemSpy).toHaveBeenCalledTimes(1);
		const payload = setItemSpy.mock.calls[0]?.[1];
		const parsed = JSON.parse(payload ?? '[]') as Array<{ text: string }>;
		expect(parsed).toHaveLength(4);
		expect(parsed.at(-1)?.text).toBe('OK');

		unmount();
	});
});
