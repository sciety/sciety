import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { CommitEvents } from './commit-events';
import { EventSourcedFollowListRepository } from './event-sourced-follow-list-repository';
import { FetchCrossrefArticle } from './fetch-crossref-article';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import { FindGroups } from './find-groups';
import { FindReviewsForArticleDoi } from './find-reviews-for-article-doi';
import { Follows } from './follows';
import { GetArticleVersionEventsFromBiorxiv } from './get-article-version-events-from-biorxiv';
import { Logger } from './logger';
import { SearchResults } from './search-europe-pmc';
import { DomainEvent } from '../domain-events';
import { GetTwitterUserDetails, GetTwitterUserId, GetUserDetailsBatch } from '../third-parties/twitter';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';

type GetGroup = (groupId: GroupId) => TE.TaskEither<DE.DataError, Group>;
type GetGroupBySlug = (slug: string) => TE.TaskEither<DE.DataError, Group>;

type GetAllGroups = TE.TaskEither<DE.DataError, RNEA.ReadonlyNonEmptyArray<Group>>;

export type Adapters = {
  commitEvents: CommitEvents,
  fetchArticle: FetchCrossrefArticle,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  findGroups: FindGroups,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: GetArticleVersionEventsFromBiorxiv,
  follows: Follows,
  getAllGroups: GetAllGroups,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getFollowList: EventSourcedFollowListRepository,
  getGroup: GetGroup,
  getGroupBySlug: GetGroupBySlug,
  getUserDetails: GetTwitterUserDetails,
  getUserDetailsBatch: GetUserDetailsBatch,
  getUserId: GetTwitterUserId,
  logger: Logger,
  searchEuropePmc: (
    pageSize: number,
  ) => (query: string, cursor: O.Option<string>) => TE.TaskEither<DE.DataError, SearchResults>,
};
