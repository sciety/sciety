import * as t from 'io-ts';
import { queryStringParameters } from '../../../standards';

export const paramsCodec = t.strict({
  [queryStringParameters.articleId]: queryStringParameters.articleIdCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
