import * as t from 'io-ts';
import * as tt from 'io-ts-types';

export const paramsCodec = t.type({
  updatedAfter: tt.optionFromNullable(tt.DateFromISOString),
  publisheraccount: tt.optionFromNullable(t.string),
});

export type Params = t.TypeOf<typeof paramsCodec>;
