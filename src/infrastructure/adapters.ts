import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { CommitEvents } from './commit-events';
import { EventSourcedFollowListRepository } from './event-sourced-follow-list-repository';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import { FindGroups } from './find-groups';
import { Follows } from './follows';
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
  findGroups: FindGroups,
  findVersionsForArticleDoi: GetArticleVersionEventsFromBiorxiv,
  follows: Follows,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getFollowList: EventSourcedFollowListRepository,
  getUserDetails: GetTwitterUserDetails,
  getUserDetailsBatch: GetUserDetailsBatch,
  getUserId: GetTwitterUserId,
  logger: Logger,
  searchEuropePmc: (
    pageSize: number,
  ) => (query: string, cursor: O.Option<string>) => TE.TaskEither<DE.DataError, SearchResults>,
};
