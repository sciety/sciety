import {
  createServer, IncomingMessage, Server, ServerResponse,
} from 'http';
import Router from 'find-my-way';
import handler from 'serve-handler';
import createLogger from './logger';

export default (router: Router.Instance<Router.HTTPVersion.V1>): Server => {
  const log = createLogger('server');
  const requestLog = log.extend('request');
  const responseLog = log.extend('response');

  const server = createServer(async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    requestLog(`${request.method} ${request.url} HTTP/${request.httpVersion}`);

    if (request.url?.startsWith('/static/')) {
      await handler(request, response);
    } else {
      router.lookup(request, response);
    }

    responseLog(`HTTP/${request.httpVersion} ${response.statusCode} ${response.statusMessage}`);
  });

  server.on('listening', (): void => log('Server running'));
  server.on('close', (): void => log('Server stopping'));

  return server;
};
