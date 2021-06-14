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
import { bootstrapGroups } from '../../src/data/bootstrap-groups';
import { createRouter } from '../../src/http/router';
import { createApplicationServer } from '../../src/http/server';
import { Adapters } from '../../src/infrastructure/adapters';
import { FetchCrossrefArticle } from '../../src/infrastructure/fetch-crossref-article';
import { fetchDataciteReview } from '../../src/infrastructure/fetch-datacite-review';
import { FetchDataset } from '../../src/infrastructure/fetch-dataset';
import { fetchHypothesisAnnotation } from '../../src/infrastructure/fetch-hypothesis-annotation';
import { EvaluationFetcher, fetchReview } from '../../src/infrastructure/fetch-review';
import { inMemoryGroupRepository } from '../../src/infrastructure/in-memory-groups';
import { FollowList } from '../../src/types/follow-list';
import { SanitisedHtmlFragment } from '../../src/types/sanitised-html-fragment';
import { dummyLogger } from '../dummy-logger';
import { arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';

type TestServer = {
  adapters: Adapters,
  server: Server,
};

export const createTestServer = async (): Promise<TestServer> => {
  const groups = inMemoryGroupRepository(bootstrapGroups);
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

  const fetchers = new Map<string, EvaluationFetcher>();
  fetchers.set('doi', fetchDataciteReview(fetchDataCiteDataset, dummyLogger));
  fetchers.set('hypothesis', fetchHypothesisAnnotation(shouldNotBeCalled, dummyLogger));
  fetchers.set('ncrc', () => TE.left('unavailable'));
  fetchers.set('prelights', () => TE.left('unavailable'));
  fetchers.set('rapidreviews', () => TE.left('unavailable'));

  const adapters: Adapters = {
    fetchArticle,
    fetchReview: fetchReview(fetchers),
    fetchStaticFile: (filename: string) => TE.right(`Contents of ${filename}`),
    findGroups: () => T.of([]),
    searchEuropePmc: () => () => TE.right({ items: [], total: 0, nextCursor: O.some(arbitraryWord()) }),
    getGroup: groups.lookup,
    getAllGroups: groups.all,
    findReviewsForArticleDoi: () => T.of([]),
    getAllEvents: T.of([]),
    commitEvents: () => T.of(undefined),
    logger: dummyLogger,
    getFollowList: (userId) => T.of(new FollowList(userId)),
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
  };
};
