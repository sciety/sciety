import { load } from 'cheerio';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { Logger } from '../../../logger';
import * as DE from '../../../types/data-error';
import { toHtmlFragment } from '../../../types/html-fragment';
import { sanitise } from '../../../types/sanitised-html-fragment';
import { QueryExternalService } from '../../query-external-service';
import { EvaluationDigestFetcher } from '../evaluation-digest-fetcher';

export const fetchPrelightsHighlight = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationDigestFetcher => (url: string) => pipe(
  url,
  queryExternalService(),
  TE.chainEitherKW(flow(
    t.string.decode,
    E.mapLeft(formatValidationErrors),
    E.mapLeft((errors) => {
      logger('error', 'preLights response is not a string', { errors, url });
      return DE.unavailable;
    }),
  )),
  TE.chainEitherKW(flow(
    (html) => load(html),
    (parsedDocument) => parsedDocument('meta[property="og:description"]:not([content=""])').attr('content'),
    O.fromNullable,
    E.fromOption(() => DE.unavailable),
    E.map((text) => `<h3>Excerpt</h3><p>${text}</p>`),
    E.map(toHtmlFragment),
    E.map(sanitise),
  )),
);
