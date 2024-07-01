/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Logger } from '../../logger';
import * as EDOI from '../../types/expression-doi';
import { ExternalQueries } from '../external-queries';
import { QueryExternalService } from '../query-external-service';

export const fetchByCategory = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): ExternalQueries['fetchByCategory'] => () => pipe(
  [
    EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
  ],
  TE.right,
);
