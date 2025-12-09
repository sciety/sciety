/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { EvaluationDigestFetcher } from './evaluation-digest-fetcher';
import { hardcodedPciEvaluationDigests } from './hardcoded-pci-evaluation-digests';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { QueryExternalService } from '../query-external-service';

export const fetchPciEvaluationDigest = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationDigestFetcher => (key: string) => pipe(
  hardcodedPciEvaluationDigests,
  R.lookup(key),
  O.match(
    () => TE.left(DE.unavailable),
    (html) => TE.right(sanitise(toHtmlFragment(html))),
  ),
);
