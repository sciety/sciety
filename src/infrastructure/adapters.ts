import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { EventSourcedFollowListRepository } from './event-sourced-follow-list-repository';
import { FetchCrossrefArticle } from './fetch-crossref-article';
import { FetchReview } from './fetch-review';
import { ArticleVersion } from './get-article-version-events-from-biorxiv';
import { GetTwitterUserDetails } from './get-twitter-user-details';
import { GetTwitterUserId } from './get-twitter-user-id';
import { Logger } from './logger';
import { SearchResults } from './search-europe-pmc';
import { DomainEvent, RuntimeGeneratedEvent } from '../domain-events';
import { ArticleServer } from '../types/article-server';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  groupId: GroupId,
  occurredAt: Date,
}>>;

type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer,
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>;

type GetGroup = (groupId: GroupId) => TO.TaskOption<Group>;
type GetGroupBySlug = (slug: string) => TO.TaskOption<Group>;

type GetAllGroups = TE.TaskEither<DE.DataError, RNEA.ReadonlyNonEmptyArray<Group>>;

type UserDetails = {
  avatarUrl: string,
  displayName: string,
  handle: string,
  userId: UserId,
};

type GetUserDetailsBatch = (userId: ReadonlyArray<UserId>) => TE.TaskEither<DE.DataError, ReadonlyArray<UserDetails>>;

export type Adapters = {
  commitEvents: (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>,
  fetchArticle: FetchCrossrefArticle,
  fetchReview: FetchReview,
  fetchStaticFile: (filename: string) => TE.TaskEither<DE.DataError, string>,
  findGroups: (query: string) => T.Task<ReadonlyArray<GroupId>>,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  follows: (userId: UserId, groupId: GroupId) => T.Task<boolean>,
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
