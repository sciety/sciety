import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { DoiFromString } from '../types/codecs/DoiFromString';
import * as RI from '../types/review-id';

const readableEvaluation = t.type({
  date: DateFromISOString,
  articleDoi: DoiFromString,
  evaluationLocator: RI.reviewIdCodec,
  authors: t.readonlyArray(t.string),
});

const readableEvaluations = t.readonlyArray(readableEvaluation);

export type ReadableEvaluations = ReadonlyArray<t.TypeOf<typeof readableEvaluation> & { publishedAt: Date }>;

export const decodeEvaluationsFromJsonl = flow(
  (fileContents: string) => fileContents.split('\n'),
  RA.filter((line) => line !== ''),
  E.traverseArray(tt.JsonFromString.decode),
  E.chain(readableEvaluations.decode),
  E.bimap(
    PR.failure,
    RA.map((incompleteReadableEvaluation) => ({
      ...incompleteReadableEvaluation,
      publishedAt: incompleteReadableEvaluation.date,
    })),
  ),
);

type WriteableEvaluation = {
  date: Date,
  articleDoi: string,
  evaluationLocator: string,
  authors?: ReadonlyArray<string>,
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
        authors: evaluation.authors ? evaluation.authors : [],
      }
    ),
    tt.JsonFromString.encode,
  )),
  (events) => `${events.join('\n')}`,
);
