import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { ElizaService } from '@buf/connectrpc_eliza.bufbuild_es/connectrpc/eliza/v1/eliza_pb';

const transport = createConnectTransport({
	baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://demo.connectrpc.com',
});

export const elizaClient = createClient(ElizaService, transport);
