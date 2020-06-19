import { NotFound, ServiceUnavailable } from 'http-errors';
import { Context, Middleware, Next } from 'koa';
import { FetchDatasetError } from '../../api/fetch-dataset';
import { FetchReview } from '../../api/fetch-review';
import Doi from '../../data/doi';
import createLogger from '../../logger';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import ReviewReferenceRepository from '../../types/review-reference-repository';
import { ArticlePageViewModel } from '../types/article-page-view-model';

const log = createLogger('middleware:fetch-reviews-for-article-page');

export interface Review {
  publicationDate: Date;
  summary: string;
  doi: Doi;
  editorialCommunityId: string;
}

export default (
  reviewReferenceRepository: ReviewReferenceRepository,
  fetchReview: FetchReview,
  editorialCommunities: EditorialCommunityRepository,
): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const doi: Doi = ctx.state.articleDoi;

    const reviews = await Promise.all(reviewReferenceRepository.findReviewsForArticleVersionDoi(doi)
      .map(async (reviewReference) => {
        const fetchedReview = await fetchReview(reviewReference.reviewDoi);

        return {
          ...reviewReference,
          ...fetchedReview,
        };
      }))
      .catch((error) => {
        log(`Failed to load reviews for article ${doi}: (${error})`);

        if (error instanceof FetchDatasetError) {
          throw new ServiceUnavailable('Article temporarily unavailable. Please try refreshing.');
        }

        throw new NotFound(`${doi} not found`);
      });

    const reviewSummaries = reviews.map((review: Review) => {
      const editorialCommunity = editorialCommunities.lookup(review.editorialCommunityId);
      return {
        ...review,
        editorialCommunityName: editorialCommunity ? editorialCommunity.name : 'Unknown',
      };
    });

    ctx.state.articlePage = {
      reviews: reviewSummaries,
    } as ArticlePageViewModel;

    await next();
  }
);
