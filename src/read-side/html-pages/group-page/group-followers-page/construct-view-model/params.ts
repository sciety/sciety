import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { queryStringParameters } from '../../../../../standards';
import { userIdCodec } from '../../../../../types/user-id';

export const paramsCodec = t.type({
  slug: t.string,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
  [queryStringParameters.page]: queryStringParameters.pageCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
