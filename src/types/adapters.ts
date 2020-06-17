import EditorialCommunityRepository from './editorial-community-repository';
import ReviewReferenceRepository from './review-reference-repository';
import { FetchArticle } from '../api/fetch-article';
import { FetchReview } from '../api/fetch-review';
import { FetchStaticFile } from '../api/fetch-static-file';
import { GetBiorxivCommentCount } from '../infrastructure/get-biorxiv-comment-count';

export interface Adapters {
  fetchArticle: FetchArticle;
  getBiorxivCommentCount: GetBiorxivCommentCount;
  fetchReview: FetchReview;
  fetchStaticFile: FetchStaticFile;
  editorialCommunities: EditorialCommunityRepository;
  reviewReferenceRepository: ReviewReferenceRepository;
  getJson: (uri: string) => Promise<object>;
}
