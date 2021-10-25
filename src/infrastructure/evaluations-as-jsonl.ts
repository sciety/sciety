import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { DoiFromString } from '../types/codecs/DoiFromString';
import * as RI from '../types/review-id';

const readableEvaluations = t.readonlyArray(t.type({
  date: DateFromISOString,
  articleDoi: DoiFromString,
  evaluationLocator: RI.reviewIdCodec,
}));

export type ReadableEvaluations = t.TypeOf<typeof readableEvaluations>;

export const decodeEvaluationsFromJsonl = flow(
  (wholeFile: string) => wholeFile.split('\n'),
  RA.filter((s) => s.length > 0),
  E.traverseArray(tt.JsonFromString.decode),
  E.chain(readableEvaluations.decode),
  E.mapLeft(PR.failure),
);

type WriteableEvaluation = {
  date: Date,
  articleDoi: string,
  evaluationLocator: string,
};

type WriteableEvaluations = ReadonlyArray<WriteableEvaluation>;

export const encodeEvaluationsToJsonl = (evaluations: WriteableEvaluations): string => pipe(
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
