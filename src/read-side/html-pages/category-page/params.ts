import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { queryStringParameters } from '../../../standards';

export const paramsCodec = t.type({
  [queryStringParameters.title]: tt.NonEmptyString,
});

export type Params = t.TypeOf<typeof paramsCodec>;
