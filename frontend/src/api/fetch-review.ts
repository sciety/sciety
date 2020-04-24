import article3 from '../data/article3';
import article4 from '../data/article4';
import { Review } from '../types/review';

export type FetchReview = (doi: string) => Promise<Review>;

export default (): FetchReview => (
  async (doi: string): Promise<Review> => {
    const allReviews = [
      ...article3.reviews,
      ...article4.reviews,
    ];

    const foundReview = allReviews.find((review) => review.doi === doi);
    if (!foundReview) {
      throw new Error(`Review DOI ${doi} not found`);
    }

    return foundReview;
  }
);
