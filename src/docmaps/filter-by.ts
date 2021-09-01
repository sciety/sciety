import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as Doi from '../types/doi';

export const paramsCodec = t.type({
  updatedAfter: tt.optionFromNullable(tt.DateFromISOString),
});

export type Params = t.TypeOf<typeof paramsCodec>;

export const filterBy = (params: Params) => (dois: ReadonlyArray<Doi.Doi>): ReadonlyArray<Doi.Doi> => pipe(
  params.updatedAfter,
  O.fold(
    () => dois,
    () => dois,
  ),
);
