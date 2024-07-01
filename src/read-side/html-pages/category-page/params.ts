import * as t from 'io-ts';
import { queryStringParameters } from '../../../standards';

export const paramsCodec = t.type({
  [queryStringParameters.categoryName]: queryStringParameters.categoryNameCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
