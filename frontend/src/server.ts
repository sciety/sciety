import debug from 'debug';
import http, { IncomingMessage, Server, ServerResponse } from 'http';
import handler from 'serve-handler';

const log = debug('http:server');
const requestLog = log.extend('request');
const responseLog = log.extend('response');

const server = http.createServer(async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  requestLog(`${request.method} ${request.url} HTTP/${request.httpVersion}`);

  await handler(request, response, { public: 'static' });

  responseLog(`HTTP/${request.httpVersion} ${response.statusCode} ${response.statusMessage}`);
});

export default (): Server => server;
