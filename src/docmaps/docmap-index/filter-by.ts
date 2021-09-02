import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import * as Doi from '../../types/doi';

export const paramsCodec = t.type({
  updatedAfter: tt.optionFromNullable(tt.DateFromISOString),
  group: tt.optionFromNullable(GroupIdFromString),
});

export type Params = t.TypeOf<typeof paramsCodec>;

// ts-unused-exports:disable-next-line
export const filterBy = (params: Params) => (dois: ReadonlyArray<Doi.Doi>): ReadonlyArray<Doi.Doi> => pipe(
  params.updatedAfter,
  O.fold(
    () => dois,
    () => dois,
  ),
);
