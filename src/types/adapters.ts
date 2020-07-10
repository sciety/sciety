import EditorialCommunityRepository from './editorial-community-repository';
import EndorsementsRepository from './endorsements-repository';
import ReviewReferenceRepository from './review-reference-repository';
import { FetchCrossrefArticle } from '../infrastructure/fetch-crossref-article';
import { FetchReview } from '../infrastructure/fetch-review';
import { FetchStaticFile } from '../infrastructure/fetch-static-file';
import { GetBiorxivCommentCount } from '../infrastructure/get-biorxiv-comment-count';
import { Logger } from '../infrastructure/logger';
import { SearchEuropePmc } from '../infrastructure/search-europe-pmc';

export interface Adapters {
  fetchArticle: FetchCrossrefArticle;
  getBiorxivCommentCount: GetBiorxivCommentCount;
  fetchReview: FetchReview;
  fetchStaticFile: FetchStaticFile;
  searchEuropePmc: SearchEuropePmc,
  editorialCommunities: EditorialCommunityRepository;
  endorsements: EndorsementsRepository,
  reviewReferenceRepository: ReviewReferenceRepository;
  logger: Logger;
}
