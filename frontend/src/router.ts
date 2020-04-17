import Router from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';

type DefaultRoute = (request: IncomingMessage, response: ServerResponse) => void;

export default (defaultRoute: DefaultRoute): Router.Instance<Router.HTTPVersion.V1> => {
  const router = Router({ defaultRoute });

  router.on('GET', '/ping', (request: IncomingMessage, response: ServerResponse): void => {
    response.setHeader('Cache-Control', 'no-store, must-revalidate');
    response.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    response.writeHead(OK);
    response.end('pong');
  });

  return router;
};
