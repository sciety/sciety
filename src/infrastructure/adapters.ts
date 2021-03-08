import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { EventSourcedFollowListRepository } from './event-sourced-follow-list-repository';
import { FetchCrossrefArticle } from './fetch-crossref-article';
import { FetchReview } from './fetch-review';
import { GetArticleVersionEventsFromBiorxiv } from './get-article-version-events-from-biorxiv';
import { GetTwitterUserDetails } from './get-twitter-user-details';
import { Logger } from './logger';
import { SearchEuropePmc } from './search-europe-pmc';
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

type GetGroup = (editorialCommunityId: GroupId) => T.Task<O.Option<Group>>;

type GetAllEditorialCommunities = T.Task<RNEA.ReadonlyNonEmptyArray<Group>>;

export type Adapters = {
  fetchArticle: FetchCrossrefArticle,
  fetchReview: FetchReview,
  fetchStaticFile: (filename: string) => TE.TaskEither<'not-found' | 'unavailable', string>,
  searchEuropePmc: SearchEuropePmc,
  getGroup: GetGroup,
  getAllEditorialCommunities: GetAllEditorialCommunities,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: GetArticleVersionEventsFromBiorxiv,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>,
  getFollowList: EventSourcedFollowListRepository,
  getUserDetails: GetTwitterUserDetails,
  follows: (userId: UserId, editorialCommunityId: GroupId) => T.Task<boolean>,
  logger: Logger,
};
