import {
  createServer, IncomingMessage, Server, ServerResponse,
} from 'http';
import handler from 'serve-handler';
import createLogger from './logger';
import createRouter, { RouterServices } from './router';

type Services = RouterServices;

export default (services: Services): Server => {
  const log = createLogger('server');
  const requestLog = log.extend('request');
  const responseLog = log.extend('response');

  const defaultRoute = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    await handler(request, response, { public: 'static' });
  };
  const router = createRouter(defaultRoute, services);

  const server = createServer(async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    requestLog(`${request.method} ${request.url} HTTP/${request.httpVersion}`);

    router.lookup(request, response);

    responseLog(`HTTP/${request.httpVersion} ${response.statusCode} ${response.statusMessage}`);
  });

  server.on('listening', (): void => log('Server running'));
  server.on('close', (): void => log('Server stopping'));

  return server;
};
