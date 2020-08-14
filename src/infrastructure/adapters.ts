import { FetchCrossrefArticle } from './fetch-crossref-article';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import { FilterEvents } from './filter-events';
import { GetBiorxivCommentCount } from './get-biorxiv-comment-count';
import { FindReviewsForArticleVersionDoi, FindReviewsForEditorialCommunityId } from './in-memory-review-references';
import { Logger } from './logger';
import { SearchEuropePmc } from './search-europe-pmc';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import EndorsementsRepository from '../types/endorsements-repository';
import ReviewReferenceRepository from '../types/review-reference-repository';

export interface Adapters {
  fetchArticle: FetchCrossrefArticle;
  getBiorxivCommentCount: GetBiorxivCommentCount;
  fetchReview: FetchReview;
  fetchStaticFile: FetchStaticFile;
  searchEuropePmc: SearchEuropePmc,
  editorialCommunities: EditorialCommunityRepository;
  endorsements: EndorsementsRepository,
  reviewReferenceRepository: ReviewReferenceRepository;
  findReviewsForArticleVersionDoi: FindReviewsForArticleVersionDoi;
  findReviewsForEditorialCommunityId: FindReviewsForEditorialCommunityId;
  filterEvents: FilterEvents;
  logger: Logger;
}
