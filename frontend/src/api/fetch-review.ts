import { namedNode } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import { FetchDataset } from './fetch-dataset';
import { Review } from '../types/review';

export type FetchReview = (doi: string) => Promise<Review>;

export default (fetchDataset: FetchDataset): FetchReview => (
  async (doi: string): Promise<Review> => {
    const reviewIri = namedNode(`https://doi.org/${doi}`);
    const dataset = await fetchDataset(reviewIri);

    const [{ object: authorIri }] = dataset.match(reviewIri, schema.author);
    const [author] = dataset.match(authorIri, schema.name);
    const [datePublished] = dataset.match(reviewIri, schema.datePublished);
    const [summary] = dataset.match(reviewIri, schema.description);

    return {
      author: author.object.value,
      doi,
      publicationDate: new Date(datePublished.object.value),
      summary: summary.object.value,
    };
  }
);
