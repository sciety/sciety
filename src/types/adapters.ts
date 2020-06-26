import EditorialCommunityRepository from './editorial-community-repository';
import { Json } from './json';
import ReviewReferenceRepository from './review-reference-repository';
import { FetchCrossrefArticle } from '../infrastructure/fetch-crossref-article';
import { FetchReview } from '../infrastructure/fetch-review';
import { FetchStaticFile } from '../infrastructure/fetch-static-file';
import { GetBiorxivCommentCount } from '../infrastructure/get-biorxiv-comment-count';

export interface Adapters {
  fetchArticle: FetchCrossrefArticle;
  getBiorxivCommentCount: GetBiorxivCommentCount;
  fetchReview: FetchReview;
  fetchStaticFile: FetchStaticFile;
  editorialCommunities: EditorialCommunityRepository;
  reviewReferenceRepository: ReviewReferenceRepository;
  getJson: (uri: string) => Promise<Json>;
}
