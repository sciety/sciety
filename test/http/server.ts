import { Server } from 'http';
import { literal, namedNode } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import datasetFactory from 'rdf-dataset-indexed';
import { Result } from 'true-myth';
import bootstrapEditorialCommunities from '../../src/data/bootstrap-editorial-communities';
import createRouter from '../../src/http/router';
import createServer from '../../src/http/server';
import { Adapters } from '../../src/infrastructure/adapters';
import { FetchCrossrefArticle } from '../../src/infrastructure/fetch-crossref-article';
import createFetchDataciteReview from '../../src/infrastructure/fetch-datacite-review';
import { FetchDataset } from '../../src/infrastructure/fetch-dataset';
import createFetchHypothesisAnnotation from '../../src/infrastructure/fetch-hypothesis-annotation';
import createFetchReview from '../../src/infrastructure/fetch-review';
import createEditorialCommunityRepository from '../../src/infrastructure/in-memory-editorial-communities';
import createEndorsementsRepository from '../../src/infrastructure/in-memory-endorsements-repository';
import createReviewProjections from '../../src/infrastructure/review-projections';
import EditorialCommunityRepository from '../../src/types/editorial-community-repository';
import FollowList from '../../src/types/follow-list';
import { SanitisedHtmlFragment } from '../../src/types/sanitised-html-fragment';
import dummyLogger from '../dummy-logger';
import shouldNotBeCalled from '../should-not-be-called';

interface TestServer {
  adapters: Adapters,
  server: Server;
  editorialCommunities: EditorialCommunityRepository;
}

export default async (): Promise<TestServer> => {
  const editorialCommunities = createEditorialCommunityRepository(dummyLogger);
  for (const editorialCommunity of bootstrapEditorialCommunities) {
    void editorialCommunities.add(editorialCommunity);
  }
  const reviewProjections = createReviewProjections([]);
  const fetchDataCiteDataset: FetchDataset = async () => (
    clownface({ dataset: datasetFactory(), term: namedNode('http://example.com/some-datacite-node') })
      .addOut(schema.datePublished, literal('2020-02-20', schema.Date))
      .addOut(schema.description, 'The full text')
      .addOut(schema.author, (author) => author.addOut(schema.name, 'Author name'))
  );
  const fetchArticle: FetchCrossrefArticle = async (doi) => (Result.ok({
    abstract: 'Article abstract.' as SanitisedHtmlFragment,
    authors: [],
    doi,
    title: 'Article title' as SanitisedHtmlFragment,
    publicationDate: new Date(),
  }));
  const fetchReview = createFetchReview(
    createFetchDataciteReview(fetchDataCiteDataset, dummyLogger),
    createFetchHypothesisAnnotation(shouldNotBeCalled, dummyLogger),
  );

  const adapters: Adapters = {
    fetchArticle,
    fetchReview,
    fetchStaticFile: async (filename: string) => `Contents of ${filename}`,
    searchEuropePmc: async () => ({ items: [], total: 0 }),
    editorialCommunities,
    getEditorialCommunity: editorialCommunities.lookup,
    getAllEditorialCommunities: async () => [],
    endorsements: createEndorsementsRepository([]),
    ...reviewProjections,
    getAllEvents: T.of([]),
    commitEvents: async () => {},
    logger: dummyLogger,
    getFollowList: async (userId) => new FollowList(userId),
    getUserDetails: () => TE.right({
      avatarUrl: '',
      displayName: '',
      handle: '',
    }),
    follows: async () => false,
    findVersionsForArticleDoi: async () => [],
  };

  const router = createRouter(adapters);
  return {
    adapters,
    server: createServer(router, dummyLogger),
    editorialCommunities,
  };
};
