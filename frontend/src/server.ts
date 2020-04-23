import debug, { Debugger } from 'debug';
import {
  createServer, IncomingMessage, Server, ServerResponse,
} from 'http';
import handler from 'serve-handler';
import createRouter, { RouterServices } from './router';

type Services = {
  log?: Debugger;
} & RouterServices;

export default ({ log = debug('http:server'), fetchReviewedArticle }: Services): Server => {
  const requestLog = log.extend('request');
  const responseLog = log.extend('response');

  const defaultRoute = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    await handler(request, response, { public: 'static' });
  };
  const router = createRouter(defaultRoute, { fetchReviewedArticle });

  return createServer(async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    requestLog(`${request.method} ${request.url} HTTP/${request.httpVersion}`);

    router.lookup(request, response);

    responseLog(`HTTP/${request.httpVersion} ${response.statusCode} ${response.statusMessage}`);
  });
};
