import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { getActivityForDoi } from './get-activity-for-doi';
import { ReadModel } from './handle-event';

const queryBuilders = {
  getActivityForDoi,
};

export type Queries = {
  [K in keyof typeof queryBuilders]: ReturnType<typeof queryBuilders[K]>
};

export const queries = (instance: ReadModel): Queries => pipe(
  queryBuilders,
  R.map((builder) => builder(instance)),
);
