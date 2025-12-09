/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from 'fp-ts/TaskEither';
import { EvaluationDigestFetcher } from './evaluation-digest-fetcher';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import { QueryExternalService } from '../query-external-service';

export const fetchPciEvaluationDigest = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationDigestFetcher => (key: string) => TE.left(DE.unavailable);
