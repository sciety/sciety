import Router from 'find-my-way';
import { FetchReviewedArticle } from './api/fetch-reviewed-article';
import article from './handlers/article';
import index from './handlers/index';
import ping from './handlers/ping';
import reviews from './handlers/reviews';
import ReviewReferenceRepository from './types/review-reference-repository';

export type RouterServices = {
  fetchReviewedArticle: FetchReviewedArticle;
  reviewReferenceRepository: ReviewReferenceRepository;
};

export default (services: RouterServices): Router.Instance<Router.HTTPVersion.V1> => {
  const router = Router();

  router.get('/ping', ping());
  router.get('/', index());
  router.get('/articles/:id', article(services.fetchReviewedArticle));
  router.post('/reviews', reviews(services.reviewReferenceRepository));

  return router;
};
