import { URL } from 'url';
import { Maybe } from 'true-myth';
import { GetReviews, Review } from './render-feed';
import EditorialCommunityId from '../types/editorial-community-id';
import HypothesisAnnotationId from '../types/hypothesis-annotation-id';
import { ReviewId } from '../types/review-id';

type GetReview = (id: ReviewId) => Promise<{
  summary: Maybe<string>;
  url: URL;
}>;
type GetEditorialCommunity = (id: EditorialCommunityId) => Promise<{ name: string}>;

export default (getReview: GetReview, getEditorialCommunity: GetEditorialCommunity) : GetReviews => (
  async (doi) => {
    const getReviewDetailsAndSource = async (reviewId: ReviewId): Promise<{ details: string, source: URL }> => {
      const review = await getReview(reviewId);
      return {
        details: review.summary.unsafelyUnwrap(),
        source: review.url,
      };
    };

    if (doi.value === '10.1101/646810') {
      const review1 = await getReviewDetailsAndSource(new HypothesisAnnotationId('GFEW8JXMEeqJQcuc-6NFhQ'));
      const review2 = await getReviewDetailsAndSource(new HypothesisAnnotationId('F4-xmpXMEeqf3_-2H0r-9Q'));
      const review3 = await getReviewDetailsAndSource(new HypothesisAnnotationId('F7e5QpXMEeqnbCM3UE6XLQ'));
      const reviews: Readonly<Array<Review>> = [
        {
          sourceUrl: review1.source,
          publicationDate: new Date('2020-05-14'),
          editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
          editorialCommunityName: (await getEditorialCommunity(new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'))).name,
          editorialCommunityAvatar: new URL('https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg'),
          details: review1.details,
        },
        {
          sourceUrl: review2.source,
          publicationDate: new Date('2020-05-14'),
          editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
          editorialCommunityName: (await getEditorialCommunity(new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'))).name,
          editorialCommunityAvatar: new URL('https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg'),
          details: review2.details,
        },
        {
          sourceUrl: review3.source,
          publicationDate: new Date('2020-05-14'),
          editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
          editorialCommunityName: (await getEditorialCommunity(new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'))).name,
          editorialCommunityAvatar: new URL('https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg'),
          details: review3.details,
        },
      ];

      return reviews;
    }

    return [];
  }
);
