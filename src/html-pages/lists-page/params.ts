import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { queryStringProperties } from '../../standards';

export const paramsCodec = t.type({
  [queryStringProperties.page]: tt.withFallback(tt.NumberFromString, 1),
});

export type Params = t.TypeOf<typeof paramsCodec>;
