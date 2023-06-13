import { pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Record';
import { getCurationStatements } from './get-curation-statements';
import { ReadModel } from './handle-event';

const queryBuilders = {
  getCurationStatements,
};

export type Queries = {
  [K in keyof typeof queryBuilders]: ReturnType<typeof queryBuilders[K]>
};

export const queries = (instance: ReadModel): Queries => pipe(
  queryBuilders,
  R.map((builder) => builder(instance)),
);
