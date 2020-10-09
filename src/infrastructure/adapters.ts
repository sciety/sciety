import { URL } from 'url';
import { Maybe } from 'true-myth';
import { CommitEvents } from './commit-events';
import { EventSourcedFollowListRepository } from './event-sourced-follow-list-repository';
import { FetchCrossrefArticle } from './fetch-crossref-article';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import { Follows } from './follows';
import { GetTwitterUserDetails } from './get-twitter-user-details';
import { Logger } from './logger';
import { FindReviewsForArticleDoi, FindReviewsForEditorialCommunityId } from './review-projections';
import { SearchEuropePmc } from './search-europe-pmc';
import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import EndorsementsRepository from '../types/endorsements-repository';
import { Json } from '../types/json';

type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
  name: string;
  avatar: URL;
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
  findReviewsForArticleDoi: FindReviewsForArticleDoi;
  findReviewsForEditorialCommunityId: FindReviewsForEditorialCommunityId;
  getAllEvents: () => Promise<ReadonlyArray<DomainEvent>>;
  commitEvents: CommitEvents;
  getFollowList: EventSourcedFollowListRepository;
  getUserDetails: GetTwitterUserDetails;
  getJson: (uri: string) => Promise<Json>;
  follows: Follows;
  logger: Logger;
}
