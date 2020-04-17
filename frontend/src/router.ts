import Router from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import ping from './handlers/ping';

type DefaultRoute = (request: IncomingMessage, response: ServerResponse) => void;

export default (defaultRoute: DefaultRoute): Router.Instance<Router.HTTPVersion.V1> => {
  const router = Router({ defaultRoute });

  router.get('/ping', ping());

  return router;
};
