import { URL } from 'url';
import { Maybe } from 'true-myth';
import { GetReviews, Review } from './render-feed';
import EditorialCommunityId from '../types/editorial-community-id';
import HypothesisAnnotationId from '../types/hypothesis-annotation-id';
import { ReviewId } from '../types/review-id';

type GetReview = (id: ReviewId) => Promise<{ summary: Maybe<string> }>;
type GetEditorialCommunity = (id: EditorialCommunityId) => Promise<{ name: string}>;

export default (getReview: GetReview, getEditorialCommunity: GetEditorialCommunity) : GetReviews => (
  async (doi) => {
    const getReviewDetails = async (reviewId: ReviewId): Promise<string> => {
      const review = getReview(reviewId);
      return (await review).summary.unsafelyUnwrap();
    };

    if (doi.value === '10.1101/646810') {
      const reviews: Readonly<Array<Review>> = [
        {
          sourceUrl: new URL('https://hyp.is/GFEW8JXMEeqJQcuc-6NFhQ/www.biorxiv.org/content/10.1101/646810v2'),
          publicationDate: new Date('2020-05-14'),
          editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
          editorialCommunityName: (await getEditorialCommunity(new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'))).name,
          editorialCommunityAvatar: new URL('https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg'),
          details: await getReviewDetails(new HypothesisAnnotationId('GFEW8JXMEeqJQcuc-6NFhQ')),
        },
        {
          sourceUrl: new URL('https://hyp.is/F4-xmpXMEeqf3_-2H0r-9Q/www.biorxiv.org/content/10.1101/646810v2'),
          publicationDate: new Date('2020-05-14'),
          editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
          editorialCommunityName: (await getEditorialCommunity(new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'))).name,
          editorialCommunityAvatar: new URL('https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg'),
          details: await getReviewDetails(new HypothesisAnnotationId('F4-xmpXMEeqf3_-2H0r-9Q')),
        },
        {
          sourceUrl: new URL('https://hyp.is/F7e5QpXMEeqnbCM3UE6XLQ/www.biorxiv.org/content/10.1101/646810v2'),
          publicationDate: new Date('2020-05-14'),
          editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
          editorialCommunityName: (await getEditorialCommunity(new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'))).name,
          editorialCommunityAvatar: new URL('https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg'),
          details: await getReviewDetails(new HypothesisAnnotationId('F7e5QpXMEeqnbCM3UE6XLQ')),
        },
      ];

      return reviews;
    }

    return [];
  }
);
