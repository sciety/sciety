import Router from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import addReview from './handlers/add-review';
import article from './handlers/article';
import article1 from './handlers/article1';
import article2 from './handlers/article2';
import index from './handlers/index';
import ping from './handlers/ping';

type DefaultRoute = (request: IncomingMessage, response: ServerResponse) => void;

export default (defaultRoute: DefaultRoute): Router.Instance<Router.HTTPVersion.V1> => {
  const router = Router({ defaultRoute });

  router.get('/ping', ping());
  router.get('/', index());
  router.get('/article1', article1());
  router.get('/article2', article2());
  router.get('/articles/:id', article());
  router.get('/add-review', addReview());

  return router;
};
