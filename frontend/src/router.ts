import Router from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { FetchReviewedArticle } from './api/fetch-reviewed-article';
import article from './handlers/article';
import index from './handlers/index';
import ping from './handlers/ping';
import reviews from './handlers/reviews';

type DefaultRoute = (request: IncomingMessage, response: ServerResponse) => void;

export type RouterServices = {
  fetchReviewedArticle: FetchReviewedArticle;
};

export default (defaultRoute: DefaultRoute, services: RouterServices): Router.Instance<Router.HTTPVersion.V1> => {
  const router = Router({ defaultRoute });

  router.get('/ping', ping());
  router.get('/', index());
  router.get('/articles/:id', article(services.fetchReviewedArticle));
  router.post('/reviews', reviews());

  return router;
};
