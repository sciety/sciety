import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { listIdCodec } from '../../../types/list-id';
import { userIdCodec } from '../../../types/user-id';
import { inputFieldNames } from '../../../standards';

export const paramsCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
  id: listIdCodec,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
  [inputFieldNames.success]: tt.withFallback(tt.BooleanFromString, false),
});

export type Params = t.TypeOf<typeof paramsCodec>;
