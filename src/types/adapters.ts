import EditorialCommunityRepository from './editorial-community-repository';
import ReviewReferenceRepository from './review-reference-repository';
import { FetchArticle } from '../api/fetch-article';
import { FetchReview } from '../api/fetch-review';

export interface Adapters {
  fetchArticle: FetchArticle;
  fetchReview: FetchReview;
  editorialCommunities: EditorialCommunityRepository;
  reviewReferenceRepository: ReviewReferenceRepository;
}
