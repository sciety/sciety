import { Json } from 'fp-ts/Json';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';

export const papersEvaluatedByGroupStatus = (readmodel: ReadModel) => (): Json => pipe(
  readmodel,
  JSON.stringify,
  JSON.parse,
) as Json;
