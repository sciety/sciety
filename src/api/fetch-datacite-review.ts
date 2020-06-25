import { namedNode } from '@rdfjs/data-model';
import { dcterms, schema } from '@tpluscode/rdf-ns-builders';
import { FetchDataset } from './fetch-dataset';
import Doi from '../data/doi';
import createLogger from '../logger';
import { Review } from '../types/review';
import { ReviewId } from '../types/review-id';

export type FetchDataciteReview = (id: ReviewId) => Promise<Review>;

export default (fetchDataset: FetchDataset): FetchDataciteReview => {
  const log = createLogger('api:fetch-datacite-review');
  return async (id: ReviewId): Promise<Review> => {
    if (!(id instanceof Doi)) {
      throw new Error(`${id} is not a DOI`);
    }

    const reviewIri = namedNode(`https://doi.org/${id.value}`);
    log(`Fetching review ${reviewIri.value} from Datacite`);
    const graph = await fetchDataset(reviewIri);

    const publicationDate = new Date(graph.out([
      schema.datePublished,
      dcterms.date,
    ]).value ?? 0);
    const summary = graph.out(schema.description).value ?? '';

    const response: Review = {
      publicationDate,
      summary,
    };
    log(`Retrieved review: ${JSON.stringify({ id, publicationDate })}`);
    return response;
  };
};
