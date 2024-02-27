import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { QueryExternalService } from '../../query-external-service';
import { EvaluationFetcher } from '../evaluation-fetcher';
import * as DE from '../../../types/data-error';
import { toHtmlFragment } from '../../../types/html-fragment';
import { sanitise } from '../../../types/sanitised-html-fragment';
import { Logger } from '../../../shared-ports';

export const fetchPrelightsHighlight = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationFetcher => (url: string) => pipe(
  url,
  queryExternalService(),
  TE.chainEitherKW(flow(
    t.string.decode,
    E.mapLeft(formatValidationErrors),
    E.mapLeft((errors) => {
      logger('error', 'RapidReviews response is not a string', { errors, url });
      return DE.unavailable;
    }),
  )),
  TE.chainEitherKW(flow(
    (doc) => new JSDOM(doc),
    (dom) => dom.window.document.querySelector('meta[property="og:description"]:not([content=""])'),
    (meta) => meta?.getAttribute('content'),
    O.fromNullable,
    E.fromOption(() => DE.unavailable),
    E.map((text) => `<h3>Excerpt</h3><p>${text}</p>`),
    E.map(toHtmlFragment),
    E.map(sanitise),
  )),
  TE.map((text) => ({
    url: new URL(url),
    fullText: text,
  })),
);
