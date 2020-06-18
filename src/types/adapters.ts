import EditorialCommunityRepository from './editorial-community-repository';
import ReviewReferenceRepository from './review-reference-repository';
import { FetchCrossrefArticle } from '../api/fetch-crossref-article';
import { FetchReview } from '../api/fetch-review';
import { FetchStaticFile } from '../api/fetch-static-file';
import { GetBiorxivCommentCount } from '../infrastructure/get-biorxiv-comment-count';

export interface Adapters {
  fetchArticle: FetchCrossrefArticle;
  getBiorxivCommentCount: GetBiorxivCommentCount;
  fetchReview: FetchReview;
  fetchStaticFile: FetchStaticFile;
  editorialCommunities: EditorialCommunityRepository;
  reviewReferenceRepository: ReviewReferenceRepository;
  getJson: (uri: string) => Promise<object>;
}
