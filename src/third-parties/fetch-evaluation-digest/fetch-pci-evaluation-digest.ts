/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { EvaluationDigestFetcher } from './evaluation-digest-fetcher';
import { Logger } from '../../logger';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { QueryExternalService } from '../query-external-service';

const extractPciGroupAbbreviation = identity;

const constructPciWebContentUrl = (key: string) => identity;

export const fetchPciEvaluationDigest = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationDigestFetcher => (key: string) => pipe(
  key,
  extractPciGroupAbbreviation,
  constructPciWebContentUrl(key),
  queryExternalService('error'),
  TE.map((html) => sanitise(toHtmlFragment(html as string))),
);
