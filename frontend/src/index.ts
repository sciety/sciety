import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import debug from 'debug';
import createFetchDataset from './api/fetch-dataset';
import createFetchReviewedArticle from './api/fetch-reviewed-article';
import createFetchReview from './api/fetch-review';
import createServer from './server';

const log = debug('http:server');

log('Starting server');

const fetchReviewedArticle = createFetchReviewedArticle(createFetchReview(createFetchDataset()));

const server = createServer({ log, fetchReviewedArticle });

const terminusOptions: TerminusOptions = {
  onShutdown: async (): Promise<void> => {
    log('Server shutting down');
  },
  onSignal: async (): Promise<void> => {
    log('Signal received');
  },
  signals: ['SIGINT', 'SIGTERM'],
};

createTerminus(server, terminusOptions);

server.listen(80, (): void => {
  log('Server running');
});
