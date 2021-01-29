import { URL } from 'url';
import * as T from 'fp-ts/Task';
import { Maybe } from 'true-myth';
import { CommitEvents } from './commit-events';
import { EventSourcedFollowListRepository } from './event-sourced-follow-list-repository';
import { FetchCrossrefArticle } from './fetch-crossref-article';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import { Follows } from './follows';
import { GetArticleVersionEventsFromBiorxiv } from './get-article-version-events-from-biorxiv';
import { GetTwitterUserDetails } from './get-twitter-user-details';
import { Logger } from './logger';
import { FindReviewsForArticleDoi } from './review-projections';
import { SearchEuropePmc } from './search-europe-pmc';
import { DomainEvent } from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { EditorialCommunityRepository } from '../types/editorial-community-repository';

type EditorialCommunity = {
  name: string,
  id: EditorialCommunityId,
  avatar: URL,
  descriptionPath: string,
};

type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<Maybe<EditorialCommunity>>;

type GetAllEditorialCommunities = T.Task<Array<EditorialCommunity>>;

export type Adapters = {
  fetchArticle: FetchCrossrefArticle,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  searchEuropePmc: SearchEuropePmc,
  editorialCommunities: EditorialCommunityRepository,
  getEditorialCommunity: GetEditorialCommunity,
  getAllEditorialCommunities: GetAllEditorialCommunities,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: GetArticleVersionEventsFromBiorxiv,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
  getFollowList: EventSourcedFollowListRepository,
  getUserDetails: GetTwitterUserDetails,
  follows: Follows,
  logger: Logger,
};
