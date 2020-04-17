import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import debug from 'debug';
import http, { IncomingMessage, ServerResponse } from 'http';
import handler from 'serve-handler';

const log = debug('http:server');
const requestLog = log.extend('request');
const responseLog = log.extend('response');

log('Starting server');

const server = http.createServer(async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  requestLog(`${request.method} ${request.url} HTTP/${request.httpVersion}`);

  await handler(request, response, { public: 'static' });

  responseLog(`HTTP/${request.httpVersion} ${response.statusCode} ${response.statusMessage}`);
})

const terminusOptions: TerminusOptions = {
  onShutdown: async (): Promise<void> => {
    log('Server shutting down')
  },
  onSignal: async (): Promise<void> => {
    log('Signal received')
  },
  signals: ['SIGINT', 'SIGTERM'],
};

createTerminus(server, terminusOptions);

server.listen(80, (): void => {
  log('Server running');
});
