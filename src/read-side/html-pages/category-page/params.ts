import * as t from 'io-ts';
import { queryStringParameters } from '../../../standards';

export const paramsCodec = t.type({
  [queryStringParameters.categoryName]: queryStringParameters.categoryNameCodec,
  [queryStringParameters.page]: queryStringParameters.pageCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
