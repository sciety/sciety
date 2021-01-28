import { URL } from 'url';
import { namedNode } from '@rdfjs/data-model';
import { dcterms, schema } from '@tpluscode/rdf-ns-builders';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { FetchDataset } from './fetch-dataset';
import { Logger } from './logger';
import { Review } from './review';
import { Doi } from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';

export type FetchDataciteReview = (doi: Doi) => T.Task<Review>;

export default (fetchDataset: FetchDataset, logger: Logger): FetchDataciteReview => (
  (doi) => async () => {
    const url = `https://doi.org/${doi.value}`;
    const reviewIri = namedNode(url);
    logger('debug', 'Fetching review from Datacite', { url });
    try {
      const graph = await fetchDataset(reviewIri);
      const publicationDate = graph.out([
        schema.datePublished,
        dcterms.date,
      ]).value;
      const fullText = graph.out(schema.description).value;

      const review: Review = {
        publicationDate: pipe(publicationDate, O.fromNullable, O.map((date:string) => new Date(date))),
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
