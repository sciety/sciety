import { namedNode } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import { FetchDataset } from './fetch-dataset';
import { Review } from '../types/review';

export type FetchReview = (doi: string) => Promise<Review>;

export default (fetchDataset: FetchDataset): FetchReview => (
  async (doi: string): Promise<Review> => {
    const reviewIri = namedNode(`https://doi.org/${doi}`);
    const graph = await fetchDataset(reviewIri);

    const author = graph.out(schema.author).out(schema.name).value || 'Unknown author';
    const publicationDate = new Date(graph.out(schema.datePublished).value || '');
    const summary = graph.out(schema.description).value || 'Unknown summary';

    return {
      author,
      doi,
      publicationDate,
      summary,
    };
  }
);
