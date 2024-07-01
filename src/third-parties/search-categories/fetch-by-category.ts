import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as EDOI from '../../types/expression-doi';
import { ExternalQueries } from '../external-queries';

export const fetchByCategory = (): ExternalQueries['fetchByCategory'] => () => pipe(
  [
    EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
  ],
  TE.right,
);
