import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { userIdCodec } from '../../../../types/user-id.js';

export const paramsCodec = t.type({
  slug: t.string,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
});

export type Params = t.TypeOf<typeof paramsCodec>;
