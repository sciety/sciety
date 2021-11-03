import { URL } from 'url';
import { namedNode } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import type { NamedNode } from 'rdf-js';
import { FetchDataset } from '../../infrastructure/fetch-dataset';
import { EvaluationFetcher } from '../../infrastructure/fetch-review';
import { Logger } from '../../infrastructure/logger';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';

const fetchReviewContent = (
  fetchDataset: FetchDataset,
  logger: Logger,
  reviewIri: NamedNode,
) => pipe(
  TE.tryCatch(
    async () => fetchDataset(reviewIri),
    () => DE.unavailable, // TODO might be DE.notFound
  ),
  TE.chainEitherK(flow(
    (graph) => graph.out(schema.description).value,
    E.fromNullable(DE.unavailable),
    E.map(flow(
      toHtmlFragment,
      (fullText) => ({
        fullText,
        url: new URL(reviewIri.value),
      }),
    )),
  )),
  TE.map((evaluation) => {
    logger('debug', 'Retrieved evaluation', { evaluation });
    return evaluation;
  }),
);

export const fetchDataciteReview = (fetchDataset: FetchDataset, logger: Logger): EvaluationFetcher => flow(
  (key) => `https://doi.org/${key}`,
  (url) => {
    logger('debug', 'Fetching evaluation from Datacite', { url });
    return url;
  },
  namedNode,
  (reviewIri) => fetchReviewContent(fetchDataset, logger, reviewIri),
);
