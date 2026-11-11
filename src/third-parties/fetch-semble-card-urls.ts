import * as fs from 'fs';
import path from 'path';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { ExternalQueries } from './external-queries';
import { Logger } from '../logger';
import * as DE from '../types/data-error';
import { canonicalExpressionDoiCodec } from '../types/expression-doi';
import * as PH from '../types/publishing-history';

const sembleCardsFilename = 'semble-cards-with-doi-supported-dois.jsonl';

const sembleCardCodec = t.type({
  doi: canonicalExpressionDoiCodec,
  url: tt.NonEmptyString,
});

type SembleCard = t.TypeOf<typeof sembleCardCodec>;

const parseLine = (line: string): E.Either<unknown, SembleCard> => pipe(
  E.tryCatch(() => JSON.parse(line) as unknown, (error) => error),
  E.chainW(sembleCardCodec.decode),
);

export const parseSembleCards = (fileContents: string): ReadonlyArray<SembleCard> => pipe(
  fileContents.split('\n'),
  RA.filter((line) => line.trim() !== ''),
  RA.map(parseLine),
  RA.rights,
);

export const fetchSembleCardUrls = (logger: Logger): ExternalQueries['fetchSembleCardUrls'] => (history) => pipe(
  path.resolve(__dirname, '..', '..', 'data', sembleCardsFilename),
  TE.taskify(fs.readFile),
  TE.mapLeft((error) => {
    logger('error', 'Failed to read file', { error });
    return DE.unavailable;
  }),
  TE.map((contents) => pipe(
    String(contents),
    parseSembleCards,
    RA.filter((card) => PH.getAllExpressionDois(history).includes(card.doi)),
    RA.map((card) => card.url),
  )),
);
