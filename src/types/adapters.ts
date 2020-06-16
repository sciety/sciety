import EditorialCommunityRepository from './editorial-community-repository';
import ReviewReferenceRepository from './review-reference-repository';
import { FetchArticle } from '../api/fetch-article';
import { FetchReview } from '../api/fetch-review';
import { FetchStaticFile } from '../api/fetch-static-file';
import { FetchDisqusPostCount } from '../infrastructure/fetch-disqus-post-count';

export interface Adapters {
  fetchArticle: FetchArticle;
  fetchDisqusPostCount: FetchDisqusPostCount;
  fetchReview: FetchReview;
  fetchStaticFile: FetchStaticFile;
  editorialCommunities: EditorialCommunityRepository;
  reviewReferenceRepository: ReviewReferenceRepository;
  getJson: (uri: string) => Promise<object>;
}
