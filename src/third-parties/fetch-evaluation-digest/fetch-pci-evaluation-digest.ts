/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { EvaluationDigestFetcher } from './evaluation-digest-fetcher';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { QueryExternalService } from '../query-external-service';

const notImplementedWaitingForChangesOnPciSide: Record<string, string> = {};

export const fetchPciEvaluationDigest = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationDigestFetcher => (key: string) => pipe(
  notImplementedWaitingForChangesOnPciSide,
  R.lookup(key),
  O.match(
    () => TE.left(DE.unavailable),
    (html) => TE.right(sanitise(toHtmlFragment(html))),
  ),
);
