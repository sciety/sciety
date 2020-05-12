import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import createFetchArticle from './api/fetch-article';
import createFetchDataset from './api/fetch-dataset';
import createFetchEditorialCommunityReviewedArticles from './api/fetch-editorial-community-reviewed-articles';
import createFetchReview from './api/fetch-review';
import { article3, article4 } from './data/article-dois';
import editorialCommunities from './data/editorial-communities';
import { article3Review1, article4Review1 } from './data/review-dois';
import createReviewReferenceRepository from './data/review-references';
import createLogger from './logger';
import createRouter, { RouterServices } from './router';
import createServer from './server';

const log = createLogger();

log('Starting server');

const reviewReferenceRepository = createReviewReferenceRepository();
reviewReferenceRepository.add(article3, article3Review1, editorialCommunities[0].id, editorialCommunities[0].name);
reviewReferenceRepository.add(article4, article4Review1, editorialCommunities[1].id, editorialCommunities[1].name);

const fetchDataset = createFetchDataset();
const fetchArticle = createFetchArticle(fetchDataset);
const fetchEditorialCommunityReviewedArticles = createFetchEditorialCommunityReviewedArticles();
const fetchReview = createFetchReview(fetchDataset);
const services: RouterServices = {
  fetchArticle,
  fetchEditorialCommunityReviewedArticles,
  fetchReview,
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
