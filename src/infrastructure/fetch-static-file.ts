import * as fs from 'fs';
import path from 'path';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { Logger } from './logger';

export type FetchStaticFile = (filename: string) => TE.TaskEither<'not-found' | 'unavailable', string>;

export const fetchStaticFile = (logger: Logger): FetchStaticFile => flow(
  (filename) => path.resolve(__dirname, '..', '..', 'static', filename),
  TE.taskify(fs.readFile),
  TE.bimap(
    (error) => {
      logger('error', 'Failed to fetch static file', { error });
      return error.code === 'ENOENT' ? 'not-found' : 'unavailable';
    },
    (text) => text.toString(),
  ),
);
