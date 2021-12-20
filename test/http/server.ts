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
import { createRouter } from '../../src/http/router';
import { createApplicationServer } from '../../src/http/server';
import { Adapters } from '../../src/infrastructure';
import { FetchDataset } from '../../src/infrastructure/fetch-dataset';
import { fetchHypothesisAnnotation } from '../../src/infrastructure/fetch-hypothesis-annotation';
import { fetchReview } from '../../src/infrastructure/fetch-review';
import { FetchCrossrefArticle } from '../../src/third-parties/crossref';
import { fetchDataciteReview } from '../../src/third-parties/datacite';
import * as DE from '../../src/types/data-error';
import { SanitisedHtmlFragment } from '../../src/types/sanitised-html-fragment';
import { toUserId } from '../../src/types/user-id';
import { dummyLogger } from '../dummy-logger';
import { arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryUserId } from '../types/user-id.helper';

type TestServer = {
  adapters: Adapters,
  server: Server,
};

export const createTestServer = async (): Promise<TestServer> => {
  const fetchDataCiteDataset: FetchDataset = async () => (
    clownface({ dataset: datasetFactory(), term: namedNode('http://example.com/some-datacite-node') })
      .addOut(schema.datePublished, literal('2020-02-20', schema.Date))
      .addOut(schema.description, 'The full text')
      .addOut(schema.author, (author) => author.addOut(schema.name, 'Author name'))
  );
  const fetchArticle: FetchCrossrefArticle = (doi) => TE.right({
    abstract: 'Article abstract.' as SanitisedHtmlFragment,
    authors: O.none,
    doi,
    title: 'Article title' as SanitisedHtmlFragment,
    publicationDate: new Date(),
    server: 'biorxiv',
  });

  const fetchers = {
    doi: fetchDataciteReview(fetchDataCiteDataset, dummyLogger),
    hypothesis: fetchHypothesisAnnotation(shouldNotBeCalled, dummyLogger),
    ncrc: () => TE.left(DE.unavailable),
    prelights: () => TE.left(DE.unavailable),
    rapidreviews: () => TE.left(DE.unavailable),
  };

  const adapters: Adapters = {
    fetchArticle,
    fetchReview: fetchReview(fetchers),
    fetchStaticFile: (filename: string) => TE.right(`Contents of ${filename}`),
    searchEuropePmc: () => () => TE.right({ items: [], total: 0, nextCursor: O.some(arbitraryWord()) }),
    getAllEvents: T.of([]),
    commitEvents: () => T.of(undefined),
    logger: dummyLogger,
    getUserDetails: () => TE.right({
      avatarUrl: '',
      displayName: '',
      handle: '',
    }),
    getUserDetailsBatch: TE.traverseArray(() => TE.right({
      avatarUrl: '',
      displayName: '',
      handle: '',
      userId: toUserId(''),
    })),
    getUserId: () => TE.right(arbitraryUserId()),
    findVersionsForArticleDoi: () => T.of(O.none),
  };

  const router = createRouter(adapters);
  const server = pipe(
    createApplicationServer(router, adapters),
    E.getOrElseW((e) => {
      throw new Error(e);
    }),
  );

  return {
    adapters,
    server,
  };
};
