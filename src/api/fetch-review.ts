import { namedNode } from '@rdfjs/data-model';
import { dcterms, schema } from '@tpluscode/rdf-ns-builders';
import { FetchDataset } from './fetch-dataset';
import Doi from '../data/doi';
import createLogger from '../logger';
import { Review } from '../types/review';

export type FetchReview = (doi: Doi) => Promise<Review>;

export default (fetchDataset: FetchDataset): FetchReview => {
  const log = createLogger('api:fetch-review');
  return async (doi: Doi): Promise<Review> => {
    const reviewIri = namedNode(`https://doi.org/${doi}`);
    log(`Fetching review ${reviewIri.value}`);
    const graph = await fetchDataset(reviewIri);

    const publicationDate = new Date(graph.out([
      schema.datePublished,
      dcterms.date,
    ]).value ?? 0);
    const summary = graph.out(schema.description).value ?? '';

    const response: Review = {
      doi,
      publicationDate,
      summary,
    };
    log(`Retrieved review: ${JSON.stringify({ doi, publicationDate })}`);
    return response;
  };
};
