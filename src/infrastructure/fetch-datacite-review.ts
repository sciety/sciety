import { URL } from 'url';
import { namedNode } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { FetchDataset } from './fetch-dataset';
import { Logger } from './logger';
import { Review } from './review';
import { Doi } from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';

export type FetchDataciteReview = (doi: Doi) => T.Task<Review>;

export const createFetchDataciteReview = (fetchDataset: FetchDataset, logger: Logger): FetchDataciteReview => (
  (doi) => async () => {
    const url = `https://doi.org/${doi.value}`;
    const reviewIri = namedNode(url);
    logger('debug', 'Fetching review from Datacite', { url });
    try {
      const graph = await fetchDataset(reviewIri);
      const fullText = graph.out(schema.description).value;

      const review: Review = {
        fullText: pipe(
          fullText,
          O.fromNullable,
          O.map(toHtmlFragment),
        ),
        url: new URL(url),
      };
      logger('debug', 'Retrieved review', { review });
      return review;
    } catch (error: unknown) {
      return {
        publicationDate: O.none,
        fullText: O.none,
        url: new URL(url),
      };
    }
  }
);
