import { namedNode } from '@rdfjs/data-model';
import { dcterms, schema } from '@tpluscode/rdf-ns-builders';
import { FetchDataset } from './fetch-dataset';
import createLogger from '../logger';
import Doi from '../types/doi';
import { Review } from '../types/review';

export type FetchDataciteReview = (doi: Doi) => Promise<Review>;

export default (fetchDataset: FetchDataset): FetchDataciteReview => {
  const log = createLogger('api:fetch-datacite-review');
  return async (doi: Doi): Promise<Review> => {
    const url = `https://doi.org/${doi.value}`;
    const reviewIri = namedNode(url);
    log(`Fetching review ${reviewIri.value} from Datacite`);
    try {
      const graph = await fetchDataset(reviewIri);
      const publicationDate = new Date(graph.out([
        schema.datePublished,
        dcterms.date,
      ]).value ?? 0);
      const summary = graph.out(schema.description).value;

      const response: Review = {
        publicationDate,
        summary,
        url: new URL(url),
      };
      log(`Retrieved review: ${JSON.stringify({ doi, publicationDate })}`);
      return response;
    } catch (e) {
      return {
        url: new URL(url),
      };
    }
  };
};
