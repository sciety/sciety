import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types';
import { readTextFile } from './read-text-file';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { Doi } from '../types/doi';
import * as RI from '../types/review-id';

const readableEvaluations = t.readonlyArray(t.type({
  date: DateFromISOString,
  articleDoi: DoiFromString,
  evaluationLocator: RI.reviewIdCodec,
}));

type ReadableEvaluations = ReadonlyArray<{
  date: Date,
  articleDoi: Doi,
  evaluationLocator: RI.ReviewId,
}>;

export const readEventsFile = (filePath: string): TE.TaskEither<t.Errors, ReadableEvaluations> => pipe(
  filePath,
  readTextFile,
  T.map(E.orElse(() => E.right(''))),
  TE.chainEitherKW(flow(
    (wholeFile) => wholeFile.split('\n'),
    RA.filter((s) => s.length > 0),
    RA.map(JSON.parse),
    readableEvaluations.decode,
  )),
);

type WriteableEvaluation = {
  date: Date,
  articleDoi: string,
  evaluationLocator: string,
};

type WriteableEvaluations = ReadonlyArray<WriteableEvaluation>;

export const toCsv = (evaluations: WriteableEvaluations): string => pipe(
  evaluations,
  RA.map((evaluation) => (
    `${evaluation.date.toISOString()},${evaluation.articleDoi},${evaluation.evaluationLocator}\n`
  )),
  (events) => `Date,Article DOI,Review ID\n${events.join('')}`,
);
