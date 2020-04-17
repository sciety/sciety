import debug, { Debugger } from 'debug';
import {
  createServer, IncomingMessage, Server, ServerResponse,
} from 'http';
import handler from 'serve-handler';

export default (log: Debugger = debug('http:server')): Server => {
  const requestLog = log.extend('request');
  const responseLog = log.extend('response');

  return createServer(async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    requestLog(`${request.method} ${request.url} HTTP/${request.httpVersion}`);

    await handler(request, response, { public: 'static' });

    responseLog(`HTTP/${request.httpVersion} ${response.statusCode} ${response.statusMessage}`);
  });
};
