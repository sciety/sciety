import { Server } from 'http';
import createFetchReview from '../../src/api/fetch-review';
import createFetchReviewedArticle from '../../src/api/fetch-reviewed-article';
import reviewReferenceRepository from '../../src/data/review-references';
import createServer from '../../src/server';
import shouldNotBeCalled from '../should-not-be-called';


export default (): Server => {
  const fetchDataset = shouldNotBeCalled;
  const fetchReview = createFetchReview(fetchDataset);
  const fetchReviewedArticle = createFetchReviewedArticle(reviewReferenceRepository, fetchReview);
  return createServer({ fetchReviewedArticle, reviewReferenceRepository });
};
