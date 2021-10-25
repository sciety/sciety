import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as tt from 'io-ts-types';
import { readTextFile } from './read-text-file';
import { ReadableEvaluations, readableEvaluationsFromString } from './readable-evaluations-from-string';

export const readEventsFile = (filePath: string): TE.TaskEither<Array<string>, ReadableEvaluations> => pipe(
  filePath,
  readTextFile,
  T.map(E.orElse(() => E.right(''))),
  TE.chainEitherKW(readableEvaluationsFromString),
);

type WriteableEvaluation = {
  date: Date,
  articleDoi: string,
  evaluationLocator: string,
};

type WriteableEvaluations = ReadonlyArray<WriteableEvaluation>;

export const toJsonl = (evaluations: WriteableEvaluations): string => pipe(
  evaluations,
  RA.map(flow(
    (evaluation) => (
      {
        date: evaluation.date.toISOString(),
        articleDoi: evaluation.articleDoi,
        evaluationLocator: evaluation.evaluationLocator,
      }
    ),
    tt.JsonFromString.encode,
  )),
  (events) => `${events.join('\n')}`,
);
