import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import createFetchArticle from './api/fetch-article';
import createFetchDataset from './api/fetch-dataset';
import createFetchReview from './api/fetch-review';
import Doi from './data/doi';
import createEditorialCommunityRepository from './data/in-memory-editorial-communities';
import createReviewReferenceRepository from './data/in-memory-review-references';
import createLogger from './logger';
import createRouter from './router';
import createServer from './server';
import { Adapters } from './types/adapters';

const log = createLogger();

log('Starting server');

const editorialCommunities = createEditorialCommunityRepository();

const reviewReferenceRepository = createReviewReferenceRepository();
const bootstrapArticlesAndReviews = {
  '10.1101/642017': '10.5281/zenodo.3820276',
  '10.1101/615682': '10.5281/zenodo.3820283',
  '10.1101/629618': '10.5281/zenodo.3820289',
  '10.1101/600445': '10.5281/zenodo.3820295',
  '10.1101/252593': '10.5281/zenodo.3820302',
  '10.1101/497495': '10.5281/zenodo.3820314',
  '10.1101/856153': '10.5281/zenodo.3821160',
  '10.1101/871517': '10.5281/zenodo.3821167',
  '10.1101/610014': '10.5281/zenodo.3821171',
  '10.1101/822718': '10.5281/zenodo.3821367',
};
Object.entries(bootstrapArticlesAndReviews).forEach(([article, review]) => {
  reviewReferenceRepository.add(
    new Doi(article),
    new Doi(review),
    editorialCommunities.all()[0].id,
  );
});
reviewReferenceRepository.add(
  new Doi('10.1101/2020.03.22.002386'),
  new Doi('10.5281/zenodo.3756961'),
  editorialCommunities.all()[1].id,
);

const fetchDataset = createFetchDataset();
const adapters: Adapters = {
  fetchArticle: createFetchArticle(fetchDataset),
  fetchReview: createFetchReview(fetchDataset),
  editorialCommunities,
  reviewReferenceRepository,
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
