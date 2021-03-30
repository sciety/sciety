import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { EventSourcedFollowListRepository } from './event-sourced-follow-list-repository';
import { FetchCrossrefArticle } from './fetch-crossref-article';
import { FetchReview } from './fetch-review';
import { ArticleVersion } from './get-article-version-events-from-biorxiv';
import { GetTwitterUserDetails } from './get-twitter-user-details';
import { Logger } from './logger';
import { SearchResults } from './search-europe-pmc';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { DomainEvent, RuntimeGeneratedEvent } from '../types/domain-events';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  editorialCommunityId: GroupId,
  occurredAt: Date,
}>>;

type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer,
) => T.Task<O.Option<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>>;

type GetGroup = (groupId: GroupId) => T.Task<O.Option<Group>>;

type GetAllGroups = T.Task<RNEA.ReadonlyNonEmptyArray<Group>>;

export type Adapters = {
  commitEvents: (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>,
  fetchArticle: FetchCrossrefArticle,
  fetchReview: FetchReview,
  fetchStaticFile: (filename: string) => TE.TaskEither<'not-found' | 'unavailable', string>,
  findGroups: (query: string) => T.Task<ReadonlyArray<GroupId>>,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  follows: (userId: UserId, groupId: GroupId) => T.Task<boolean>,
  getAllGroups: GetAllGroups,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getFollowList: EventSourcedFollowListRepository,
  getGroup: GetGroup,
  getUserDetails: GetTwitterUserDetails,
  logger: Logger,
  searchEuropePmc: (query: string) => TE.TaskEither<'unavailable', SearchResults>,
};
