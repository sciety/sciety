import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import createFetchArticle from './api/fetch-article';
import createFetchDataset from './api/fetch-dataset';
import createFetchEditorialCommunityReviewedArticles from './api/fetch-editorial-community-reviewed-articles';
import createFetchReview from './api/fetch-review';
import { article3, article4 } from './data/article-dois';
import createEditorialCommunityRepository from './data/in-memory-editorial-communities';
import createReviewReferenceRepository from './data/in-memory-review-references';
import { article3Review1, article4Review1 } from './data/review-dois';
import createLogger from './logger';
import createRouter, { RouterServices } from './router';
import createServer from './server';

const log = createLogger();

log('Starting server');

const editorialCommunities = createEditorialCommunityRepository();

const reviewReferenceRepository = createReviewReferenceRepository();
reviewReferenceRepository.add(article3, article3Review1, editorialCommunities.all()[0].id);
reviewReferenceRepository.add(article4, article4Review1, editorialCommunities.all()[1].id);

const fetchDataset = createFetchDataset();
const services: RouterServices = {
  fetchArticle: createFetchArticle(fetchDataset),
  fetchEditorialCommunityReviewedArticles: createFetchEditorialCommunityReviewedArticles(editorialCommunities),
  fetchReview: createFetchReview(fetchDataset),
  editorialCommunities,
  reviewReferenceRepository,
};

const router = createRouter(services);

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
