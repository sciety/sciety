import * as t from 'io-ts';
import * as tt from 'io-ts-types';

const paramsCodec = t.type({
  errorSummary: tt.optionFromNullable(t.unknown),
});

export type Params = t.TypeOf<typeof paramsCodec>;
