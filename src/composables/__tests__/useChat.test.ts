// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useChat } from '../useChat';

// Mock API
vi.mock('../../api/eliza', () => ({
	elizaClient: {
		say: vi.fn(),
	},
}));

import { elizaClient } from '../../api/eliza';

describe('useChat', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	it('has correct initial structure', () => {
		const { messages, requestStatus, isLoading, sendMessage, clearChat } = useChat();

		expect(messages.value).toEqual([]);
		expect(requestStatus.value).toBe('idle');
		expect(isLoading.value).toBe(false);
		expect(typeof sendMessage).toBe('function');
		expect(typeof clearChat).toBe('function');
	});

	it('sendMessage adds user message', async () => {
		vi.mocked(elizaClient.say).mockResolvedValue({
			sentence: 'Hi!',
			$typeName: 'connectrpc.eliza.v1.SayResponse',
		});

		const { messages, sendMessage } = useChat();

		await sendMessage('test message');

		expect(messages.value.length).toBe(2);
		expect(messages.value[0]?.text).toBe('test message');
		expect(messages.value[0]?.sender).toBe('user');
	});

	it('sendMessage adds bot response', async () => {
		vi.mocked(elizaClient.say).mockResolvedValue({
			sentence: 'Response from Eliza',
			$typeName: 'connectrpc.eliza.v1.SayResponse',
		});

		const { messages, sendMessage } = useChat();

		await sendMessage('Hello');

		expect(messages.value[1]?.text).toBe('Response from Eliza');
		expect(messages.value[1]?.sender).toBe('bot');
	});

	it('requestStatus changes to idle after successful request', async () => {
		vi.mocked(elizaClient.say).mockResolvedValue({
			sentence: 'OK',
			$typeName: 'connectrpc.eliza.v1.SayResponse',
		});

		const { requestStatus, sendMessage } = useChat();

		await sendMessage('test');

		expect(requestStatus.value).toBe('idle');
	});

	it('adds system message on error', async () => {
		vi.mocked(elizaClient.say).mockRejectedValue(new Error('Network error'));

		const { messages, sendMessage, requestStatus } = useChat();

		await sendMessage('test');

		expect(requestStatus.value).toBe('error');
		expect(messages.value[1]?.sender).toBe('system');
		expect(messages.value[1]?.text).toBe('Network error. Please try again.');
	});

	it('does not send empty messages', async () => {
		const { messages, sendMessage } = useChat();

		await sendMessage('');
		await sendMessage('   ');

		expect(messages.value.length).toBe(0);
		expect(elizaClient.say).not.toHaveBeenCalled();
	});

	it('clearChat clears messages', async () => {
		vi.mocked(elizaClient.say).mockResolvedValue({
			sentence: 'OK',
			$typeName: 'connectrpc.eliza.v1.SayResponse',
		});
		vi.stubGlobal('confirm', () => true);

		const { messages, sendMessage, clearChat } = useChat();

		await sendMessage('test');
		expect(messages.value.length).toBe(2);

		clearChat();

		expect(messages.value.length).toBe(0);
	});
});
