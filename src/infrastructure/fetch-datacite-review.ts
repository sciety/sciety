import { URL } from 'url';
import { namedNode } from '@rdfjs/data-model';
import { dcterms, schema } from '@tpluscode/rdf-ns-builders';
import { Maybe } from 'true-myth';
import { FetchDataset } from './fetch-dataset';
import { Logger } from './logger';
import { Review } from './review';
import Doi from '../types/doi';

export type FetchDataciteReview = (doi: Doi) => Promise<Review>;

export default (fetchDataset: FetchDataset, logger: Logger): FetchDataciteReview => (
  async (doi: Doi): Promise<Review> => {
    const url = `https://doi.org/${doi.value}`;
    const reviewIri = namedNode(url);
    logger('debug', 'Fetching review from Datacite', { url });
    try {
      const graph = await fetchDataset(reviewIri);
      const publicationDate = graph.out([
        schema.datePublished,
        dcterms.date,
      ]).value;
      const summary = graph.out(schema.description).value;

      const review: Review = {
        publicationDate: Maybe.of(publicationDate).map((date:string) => new Date(date)),
        summary: Maybe.of(summary),
        url: new URL(url),
      };
      logger('debug', 'Retrieved review', { review });
      return review;
    } catch (e) {
      return {
        publicationDate: Maybe.nothing(),
        summary: Maybe.nothing(),
        url: new URL(url),
      };
    }
  }
);
