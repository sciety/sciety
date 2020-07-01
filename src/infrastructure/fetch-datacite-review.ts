import { namedNode } from '@rdfjs/data-model';
import { dcterms, schema } from '@tpluscode/rdf-ns-builders';
import { Maybe } from 'true-myth';
import { FetchDataset } from './fetch-dataset';
import { Review } from './review';
import createLogger from '../logger';
import Doi from '../types/doi';

export type FetchDataciteReview = (doi: Doi) => Promise<Review>;

export default (fetchDataset: FetchDataset): FetchDataciteReview => {
  const log = createLogger('api:fetch-datacite-review');
  return async (doi: Doi): Promise<Review> => {
    const url = `https://doi.org/${doi.value}`;
    const reviewIri = namedNode(url);
    log(`Fetching review ${reviewIri.value} from Datacite`);
    try {
      const graph = await fetchDataset(reviewIri);
      const publicationDate = graph.out([
        schema.datePublished,
        dcterms.date,
      ]).value;
      const summary = graph.out(schema.description).value;

      const response: Review = {
        publicationDate: Maybe.of(publicationDate).map((date:string) => new Date(date)),
        summary: Maybe.of(summary),
        url: new URL(url),
      };
      log(`Retrieved review: ${JSON.stringify({ doi, publicationDate })}`);
      return response;
    } catch (e) {
      return {
        publicationDate: Maybe.nothing(),
        summary: Maybe.nothing(),
        url: new URL(url),
      };
    }
  };
};
