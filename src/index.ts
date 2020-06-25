import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import axios from 'axios';
import createFetchCrossrefArticle, { MakeHttpRequest } from './api/fetch-crossref-article';
import createFetchDataciteReview from './api/fetch-datacite-review';
import createFetchDataset from './api/fetch-dataset';
import createFetchHypothesisAnnotation from './api/fetch-hypothesis-annotation';
import createFetchReview from './api/fetch-review';
import createFetchStaticFile from './api/fetch-static-file';
import bootstrapReviews from './bootstrap-reviews';
import Doi from './data/doi';
import HypothesisAnnotationId from './data/hypothesis-annotation-id';
import createEditorialCommunityRepository from './data/in-memory-editorial-communities';
import createReviewReferenceRepository from './data/in-memory-review-references';
import createGetBiorxivCommentCount from './infrastructure/get-biorxiv-comment-count';
import createGetDisqusPostCount from './infrastructure/get-disqus-post-count';
import createLogger from './logger';
import createRouter from './router';
import createServer from './server';
import { Adapters } from './types/adapters';
import { ReviewId } from './types/review-id';

const log = createLogger();

log('Starting server');

const editorialCommunities = createEditorialCommunityRepository();

const reviewReferenceRepository = createReviewReferenceRepository();
for (const {
  article, review, editorialCommunityIndex, added,
} of bootstrapReviews) {
  let reviewId: ReviewId;
  try {
    reviewId = new Doi(review);
  } catch {
    reviewId = new HypothesisAnnotationId(review);
  }
  void reviewReferenceRepository.add(
    new Doi(article),
    reviewId,
    editorialCommunities.all()[editorialCommunityIndex].id,
    added,
  );
}

const makeHttpRequest: MakeHttpRequest = async (uri, acceptHeader) => {
  const response = await axios.get(uri, { headers: { Accept: acceptHeader } });

  return response.data;
};

const getJson: Adapters['getJson'] = async (uri) => {
  const response = await axios.get(uri);

  return response.data;
};

const fetchDataset = createFetchDataset();
const fetchDataciteReview = createFetchDataciteReview(fetchDataset);
const fetchHypothesisAnnotation = createFetchHypothesisAnnotation();
const adapters: Adapters = {
  fetchArticle: createFetchCrossrefArticle(makeHttpRequest),
  getBiorxivCommentCount: createGetBiorxivCommentCount(createGetDisqusPostCount(getJson)),
  fetchReview: createFetchReview(fetchDataciteReview, fetchHypothesisAnnotation),
  fetchStaticFile: createFetchStaticFile(),
  editorialCommunities,
  reviewReferenceRepository,
  getJson,
};

const router = createRouter(adapters);

const server = createServer(router);

const terminusOptions: TerminusOptions = {
  onShutdown: async (): Promise<void> => {
    log('Shutting server down');
  },
  onSignal: async (): Promise<void> => {
    log('Signal received');
  },
  signals: ['SIGINT', 'SIGTERM'],
};

createTerminus(server, terminusOptions);

server.listen(80);
