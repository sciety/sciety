import { Maybe } from 'true-myth';
import { CommitEvents } from './commit-events';
import { EventSourcedFollowListRepository } from './event-sourced-follow-list-repository';
import { FetchCrossrefArticle } from './fetch-crossref-article';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import { Follows } from './follows';
import { GetTwitterUserDetails } from './get-twitter-user-details';
import { Logger } from './logger';
import { FindReviewsForArticleVersionDoi, FindReviewsForEditorialCommunityId } from './review-projections';
import { SearchEuropePmc } from './search-europe-pmc';
import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import EndorsementsRepository from '../types/endorsements-repository';

type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
  name: string;
  avatarUrl: string;
  descriptionPath: string;
}>>;

export interface Adapters {
  fetchArticle: FetchCrossrefArticle;
  fetchReview: FetchReview;
  fetchStaticFile: FetchStaticFile;
  searchEuropePmc: SearchEuropePmc,
  editorialCommunities: EditorialCommunityRepository;
  getEditorialCommunity: GetEditorialCommunity;
  endorsements: EndorsementsRepository,
  findReviewsForArticleVersionDoi: FindReviewsForArticleVersionDoi;
  findReviewsForEditorialCommunityId: FindReviewsForEditorialCommunityId;
  getAllEvents: () => Promise<ReadonlyArray<DomainEvent>>;
  commitEvents: CommitEvents;
  getFollowList: EventSourcedFollowListRepository;
  getUserDetails: GetTwitterUserDetails;
  follows: Follows;
  logger: Logger;
}
