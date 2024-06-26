import * as t from 'io-ts';
import * as tt from 'io-ts-types';

export const paramsCodec = t.type({
  title: tt.NonEmptyString,
});

export type Params = t.TypeOf<typeof paramsCodec>;
