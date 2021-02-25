import * as fs from 'fs';
import path from 'path';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Logger } from './logger';

export type FetchStaticFile = (filename: string) => TE.TaskEither<'not-found' | 'unavailable', string>;

export const fetchStaticFile = (logger: Logger): FetchStaticFile => (
  (filename) => {
    const fullPath = path.resolve(__dirname, '..', '..', 'static', filename);
    logger('debug', 'Fetch static file', { filename, fullPath });
    return pipe(
      fullPath,
      TE.taskify(fs.readFile),
      TE.bimap(
        (error: NodeJS.ErrnoException) => {
          logger('error', 'Failed to fetch static file', { error });
          return error.code === 'ENOENT' ? 'not-found' : 'unavailable' as const;
        },
        (text) => text.toString(),
      ),
    );
  }
);
