import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';

export const papersEvaluatedByGroupStatus = (readmodel: ReadModel) => (): unknown => pipe(
  readmodel,
);
