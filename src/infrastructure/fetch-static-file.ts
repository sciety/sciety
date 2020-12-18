import { promises as fs } from 'fs';
import path from 'path';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { Logger } from './logger';

export type FetchStaticFile = (filename: string) => T.Task<string>;

export default (logger: Logger): FetchStaticFile => (
  (filename) => {
    const fullPath: string = path.resolve(__dirname, '..', '..', 'static', filename);
    logger('debug', 'Fetch static file', { filename, fullPath });
    return pipe(
      fullPath,
      fs.readFile,
      T.of,
      T.map((text) => text.toString()),
    );
  }
);
