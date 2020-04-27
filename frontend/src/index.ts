import { IncomingMessage, ServerResponse } from 'http';
import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import handler from 'serve-handler';
import createFetchDataset from './api/fetch-dataset';
import createFetchReview from './api/fetch-review';
import createFetchReviewedArticle from './api/fetch-reviewed-article';
import reviewReferenceRepository from './data/review-references';
import createLogger from './logger';
import createRouter, { RouterServices } from './router';
import createServer from './server';

const log = createLogger();

log('Starting server');

const fetchDataset = createFetchDataset();
const fetchReview = createFetchReview(fetchDataset);
const fetchReviewedArticle = createFetchReviewedArticle(reviewReferenceRepository, fetchReview);
const services: RouterServices = { fetchReviewedArticle, reviewReferenceRepository };

const defaultRoute = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  await handler(request, response, { public: 'static' });
};
const router = createRouter(defaultRoute, services);

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
