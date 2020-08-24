import { Maybe } from 'true-myth';
import { FetchCrossrefArticle } from './fetch-crossref-article';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import { FilterEvents } from './filter-events';
import { GetBiorxivCommentCount } from './get-biorxiv-comment-count';
import { Logger } from './logger';
import { ProjectFollowListForUser } from './project-follow-list-for-user';
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
  getBiorxivCommentCount: GetBiorxivCommentCount;
  fetchReview: FetchReview;
  fetchStaticFile: FetchStaticFile;
  searchEuropePmc: SearchEuropePmc,
  editorialCommunities: EditorialCommunityRepository;
  getEditorialCommunity: GetEditorialCommunity;
  endorsements: EndorsementsRepository,
  findReviewsForArticleVersionDoi: FindReviewsForArticleVersionDoi;
  findReviewsForEditorialCommunityId: FindReviewsForEditorialCommunityId;
  filterEvents: FilterEvents;
  getAllEvents: () => Promise<ReadonlyArray<DomainEvent>>;
  commitEvent: (event: DomainEvent) => Promise<void>;
  getFollowList: ProjectFollowListForUser,
  logger: Logger;
}
