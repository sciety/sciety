import { promises as fs } from 'fs';
import path from 'path';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Logger } from './logger';

export type FetchStaticFile = (filename: string) => TE.TaskEither<never, string>;

export const fetchStaticFile = (logger: Logger): FetchStaticFile => (
  (filename) => {
    const fullPath: string = path.resolve(__dirname, '..', '..', 'static', filename);
    logger('debug', 'Fetch static file', { filename, fullPath });
    return pipe(
      fullPath,
      fs.readFile,
      T.of,
      T.map((text) => text.toString()),
      TE.rightTask,
    );
  }
);
