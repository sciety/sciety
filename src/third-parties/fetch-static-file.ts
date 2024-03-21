import * as fs from 'fs';
import path from 'path';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { Logger } from '../infrastructure-contract';
import { ExternalQueries } from './external-queries';

export const fetchStaticFile = (logger: Logger): ExternalQueries['fetchStaticFile'] => (filename) => pipe(
  path.resolve(__dirname, '..', '..', 'static', filename),
  TE.taskify(fs.readFile),
  TE.mapLeft(
    (error) => {
      logger('error', 'Failed to read file', { error });
      return error;
    },
  ),
  TE.bimap(
    (error) => (error.code === 'ENOENT' ? DE.notFound : DE.unavailable),
    String,
  ),
);
