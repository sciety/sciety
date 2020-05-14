import { FetchArticle } from '../api/fetch-article';
import { FetchEditorialCommunityReviewedArticles } from '../api/fetch-editorial-community-reviewed-articles';
import { FetchReview } from '../api/fetch-review';
import EditorialCommunityRepository from './editorial-community-repository';
import ReviewReferenceRepository from './review-reference-repository';

export interface Adapters {
  fetchArticle: FetchArticle;
  fetchEditorialCommunityReviewedArticles: FetchEditorialCommunityReviewedArticles;
  fetchReview: FetchReview;
  editorialCommunities: EditorialCommunityRepository;
  reviewReferenceRepository: ReviewReferenceRepository;
}
