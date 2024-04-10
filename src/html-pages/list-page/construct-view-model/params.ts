import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { queryStringParameters, inputFieldNames } from '../../../standards';
import { listIdCodec } from '../../../types/list-id';
import { userIdCodec } from '../../../types/user-id';

export const paramsCodec = t.type({
  [queryStringParameters.page]: queryStringParameters.pageCodec,
  id: listIdCodec,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
  [inputFieldNames.success]: tt.withFallback(tt.BooleanFromString, false),
});

export type Params = t.TypeOf<typeof paramsCodec>;
