import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import http, { IncomingMessage, ServerResponse } from 'http';
import handler from 'serve-handler';

const server = http.createServer(async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  await handler(request, response, { public: 'static' });
})

const terminusOptions: TerminusOptions = {
  onShutdown: async (): Promise<void> => {
    console.log('Server shutting down')
  },
  onSignal: async (): Promise<void> => {
    console.log('Signal received')
  },
  signals: ['SIGINT', 'SIGTERM'],
};

createTerminus(server, terminusOptions);

server.listen(80, (): void => {
  console.log('Server running');
});
