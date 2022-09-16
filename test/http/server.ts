import { Server } from 'http';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { createRouter } from '../../src/http/router';
import { createApplicationServer } from '../../src/http/server';
import { CollectedPorts } from '../../src/infrastructure';
import { fetchHypothesisAnnotation } from '../../src/infrastructure/fetch-hypothesis-annotation';
import { fetchReview } from '../../src/infrastructure/fetch-review';
import { fetchZenodoRecord } from '../../src/infrastructure/fetch-zenodo-record';
import { FetchArticle } from '../../src/shared-ports';
import * as DE from '../../src/types/data-error';
import { SanitisedHtmlFragment } from '../../src/types/sanitised-html-fragment';
import { toUserId } from '../../src/types/user-id';
import { dummyLogger } from '../dummy-logger';
import { arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryUserId } from '../types/user-id.helper';

type TestServer = {
  adapters: CollectedPorts,
  server: Server,
};

export const createTestServer = async (): Promise<TestServer> => {
  const fetchArticle: FetchArticle = (doi) => TE.right({
    abstract: 'Article abstract.' as SanitisedHtmlFragment,
    authors: O.none,
    doi,
    title: 'Article title' as SanitisedHtmlFragment,
    publicationDate: new Date(),
    server: 'biorxiv',
  });

  const fetchers = {
    doi: fetchZenodoRecord(async () => ({}), dummyLogger),
    hypothesis: fetchHypothesisAnnotation(shouldNotBeCalled, dummyLogger),
    ncrc: () => TE.left(DE.unavailable),
    prelights: () => TE.left(DE.unavailable),
    rapidreviews: () => TE.left(DE.unavailable),
  };

  const adapters: CollectedPorts = {
    addArticleToList: () => TE.left(''),
    createList: () => TE.left('not implemented'),
    fetchArticle,
    fetchReview: fetchReview(fetchers),
    fetchStaticFile: (filename: string) => TE.right(`Contents of ${filename}`),
    searchEuropePmc: () => () => TE.right({ items: [], total: 0, nextCursor: O.some(arbitraryWord()) }),
    getAllEvents: T.of([]),
    commitEvents: () => T.of('events-created'),
    logger: dummyLogger,
    getBiorxivOrMedrxivSubjectArea: () => TE.right(''),
    getListsOwnedBy: () => TE.left(DE.unavailable),
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
