import * as RA from 'fp-ts/ReadonlyArray';
import { flow } from 'fp-ts/function';
import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types';
import { DoiFromString } from '../types/codecs/DoiFromString';
import * as RI from '../types/review-id';

const readableEvaluations = t.readonlyArray(t.type({
  date: DateFromISOString,
  articleDoi: DoiFromString,
  evaluationLocator: RI.reviewIdCodec,
}));

export type ReadableEvaluations = t.TypeOf<typeof readableEvaluations>;

export const readableEvaluationsFromString = flow(
  (wholeFile: string) => wholeFile.split('\n'),
  RA.filter((s) => s.length > 0),
  RA.map(JSON.parse),
  readableEvaluations.decode,
);
