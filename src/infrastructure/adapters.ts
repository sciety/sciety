import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { CommitEvents } from './commit-events';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import { Logger } from './logger';
import { DomainEvent } from '../domain-events';
import { GetArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';
import { FetchCrossrefArticle } from '../third-parties/crossref';
import { SearchResults } from '../third-parties/europe-pmc';
import { GetTwitterUserDetails, GetTwitterUserId, GetUserDetailsBatch } from '../third-parties/twitter';
import * as DE from '../types/data-error';

export type Adapters = {
  commitEvents: CommitEvents,
  fetchArticle: FetchCrossrefArticle,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  findVersionsForArticleDoi: GetArticleVersionEventsFromBiorxiv,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getUserDetails: GetTwitterUserDetails,
  getUserDetailsBatch: GetUserDetailsBatch,
  getUserId: GetTwitterUserId,
  logger: Logger,
  searchEuropePmc: (
    pageSize: number,
  ) => (query: string, cursor: O.Option<string>) => TE.TaskEither<DE.DataError, SearchResults>,
};
