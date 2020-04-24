import { namedNode } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import article3 from '../data/article3';
import article4 from '../data/article4';
import { FetchDataset } from './fetch-dataset';
import { Review } from '../types/review';

export type FetchReview = (doi: string) => Promise<Review>;

export default (fetchDataset: FetchDataset): FetchReview => (
  async (doi: string): Promise<Review> => {
    const allReviews = [
      ...article3.reviews,
      ...article4.reviews,
    ];

    const foundReview = allReviews.find((review) => review.doi === doi);
    if (!foundReview) {
      throw new Error(`Review DOI ${doi} not found`);
    }

    const reviewIri = namedNode(`https://doi.org/${doi}`);
    const dataset = await fetchDataset(reviewIri);

    const [datePublished] = dataset.match(reviewIri, schema.datePublished);
    const [summary] = dataset.match(reviewIri, schema.description);

    return {
      ...foundReview,
      publicationDate: new Date(datePublished.object.value),
      summary: summary.object.value,
    };
  }
);
