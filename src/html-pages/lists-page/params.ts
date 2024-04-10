import * as t from 'io-ts';
import { queryStringParameters } from '../../standards';

export const paramsCodec = t.type({
  [queryStringParameters.page]: queryStringParameters.pageCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
