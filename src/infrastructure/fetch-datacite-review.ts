import { URL } from 'url';
import { namedNode } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import {
  constant, flow, pipe,
} from 'fp-ts/function';
import type { NamedNode } from 'rdf-js';
import { FetchDataset } from './fetch-dataset';
import { Logger } from './logger';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type FetchDataciteReview = (doi: Doi) => TE.TaskEither<'unavailable' | 'not-found', FoundReview>;

type FoundReview = {
  fullText: HtmlFragment,
  url: URL,
};

const fetchReviewContent = (
  fetchDataset: FetchDataset,
  logger: Logger,
  reviewIri: NamedNode,
) => pipe(
  TE.tryCatch(
    async () => fetchDataset(reviewIri),
    constant('unavailable' as const), // TODO might be 'not-found'
  ),
  TE.chain(flow(
    (graph) => graph.out(schema.description).value,
    E.fromNullable('unavailable' as const),
    E.map(toHtmlFragment),
    E.map((fullText) => ({
      fullText,
      url: new URL(reviewIri.value),
    })),
    TE.fromEither,
  )),
  TE.map((review) => {
    logger('debug', 'Retrieved review', { review });
    return review;
  }),
);

export const fetchDataciteReview = (fetchDataset: FetchDataset, logger: Logger): FetchDataciteReview => (
  (doi) => pipe(
    doi,
    (d) => `https://doi.org/${d.value}`,
    (url) => {
      logger('debug', 'Fetching review from Datacite', { url });
      return url;
    },
    namedNode,
    TE.right,
    TE.chain((reviewIri) => fetchReviewContent(fetchDataset, logger, reviewIri)),
  )
);
