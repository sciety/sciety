import * as fs from 'fs';
import path from 'path';
import * as IO from 'fp-ts/IO';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as L from './logger';
import * as DE from '../types/data-error';

type FetchStaticFile = (filename: string) => RTE.ReaderTaskEither<L.LoggerIO, DE.DataError, string>;

export const fetchStaticFile: FetchStaticFile = (filename) => (logger) => pipe(
  path.resolve(__dirname, '..', '..', 'static', filename),
  TE.taskify(fs.readFile),
  TE.swap,
  TE.chainFirstIOK(flow(
    (error) => ({ error }),
    L.error('Failed to read file'),
    IO.chain(logger),
  )),
  TE.swap,
  TE.bimap(
    (error) => (error.code === 'ENOENT' ? DE.notFound : DE.unavailable),
    String,
  ),
);
