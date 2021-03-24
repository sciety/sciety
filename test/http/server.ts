import { Server } from 'http';
import { literal, namedNode } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import datasetFactory from 'rdf-dataset-indexed';
import { bootstrapEditorialCommunities } from '../../src/data/bootstrap-editorial-communities';
import { createRouter } from '../../src/http/router';
import { createApplicationServer } from '../../src/http/server';
import { Adapters } from '../../src/infrastructure/adapters';
import { FetchCrossrefArticle } from '../../src/infrastructure/fetch-crossref-article';
import { fetchDataciteReview } from '../../src/infrastructure/fetch-datacite-review';
import { FetchDataset } from '../../src/infrastructure/fetch-dataset';
import { fetchHypothesisAnnotation } from '../../src/infrastructure/fetch-hypothesis-annotation';
import { fetchReview } from '../../src/infrastructure/fetch-review';
import { inMemoryEditorialCommunityRepository } from '../../src/infrastructure/in-memory-editorial-communities';
import { EditorialCommunityRepository } from '../../src/types/editorial-community-repository';
import { FollowList } from '../../src/types/follow-list';
import { SanitisedHtmlFragment } from '../../src/types/sanitised-html-fragment';
import { dummyLogger } from '../dummy-logger';
import { shouldNotBeCalled } from '../should-not-be-called';

type TestServer = {
  adapters: Adapters,
  server: Server,
  editorialCommunities: EditorialCommunityRepository,
};

export const createTestServer = async (): Promise<TestServer> => {
  const editorialCommunities = inMemoryEditorialCommunityRepository(bootstrapEditorialCommunities);
  const fetchDataCiteDataset: FetchDataset = async () => (
    clownface({ dataset: datasetFactory(), term: namedNode('http://example.com/some-datacite-node') })
      .addOut(schema.datePublished, literal('2020-02-20', schema.Date))
      .addOut(schema.description, 'The full text')
      .addOut(schema.author, (author) => author.addOut(schema.name, 'Author name'))
  );
  const fetchArticle: FetchCrossrefArticle = (doi) => TE.right({
    abstract: 'Article abstract.' as SanitisedHtmlFragment,
    authors: [],
    doi,
    title: 'Article title' as SanitisedHtmlFragment,
    publicationDate: new Date(),
    server: 'biorxiv',
  });

  const adapters: Adapters = {
    fetchArticle,
    fetchReview: fetchReview(
      fetchDataciteReview(fetchDataCiteDataset, dummyLogger),
      fetchHypothesisAnnotation(shouldNotBeCalled, dummyLogger),
      () => TE.left('unavailable'),
    ),
    fetchStaticFile: (filename: string) => TE.right(`Contents of ${filename}`),
    findGroups: () => T.of([]),
    searchEuropePmc: () => TE.right({ items: [], total: 0 }),
    getGroup: editorialCommunities.lookup,
    getAllEditorialCommunities: editorialCommunities.all,
    findReviewsForArticleDoi: () => T.of([]),
    getAllEvents: T.of([]),
    commitEvents: () => T.of(undefined),
    logger: dummyLogger,
    getFollowList: async (userId) => new FollowList(userId),
    getUserDetails: () => TE.right({
      avatarUrl: '',
      displayName: '',
      handle: '',
    }),
    follows: () => T.of(false),
    findVersionsForArticleDoi: () => T.of(O.none),
  };

  const router = createRouter(adapters);
  const server = pipe(
    createApplicationServer(router, dummyLogger),
    E.getOrElseW((e) => {
      throw new Error(e);
    }),
  );

  return {
    adapters,
    server,
    editorialCommunities,
  };
};
