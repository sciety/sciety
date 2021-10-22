import { Buffer } from 'buffer';
import fs from 'fs';
import csvParseSync from 'csv-parse/lib/sync';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types';
import { DoiFromString } from '../types/codecs/DoiFromString';
import * as RI from '../types/review-id';

const reviews = t.readonlyArray(t.tuple([
  DateFromISOString,
  DoiFromString,
  RI.reviewIdCodec,
]));

type Reviews = t.TypeOf<typeof reviews>;

export const readEventsFile = (filePath: string): TE.TaskEither<t.Errors, Reviews> => pipe(
  filePath,
  TE.taskify(fs.readFile),
  T.map(E.orElse(() => E.right(Buffer.from('')))),
  TE.chainEitherKW(flow(
    (fileContents) => csvParseSync(fileContents, { fromLine: 2 }) as unknown,
    reviews.decode,
  )),
);
