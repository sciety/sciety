import * as t from 'io-ts';
import { queryStringParameters } from '../../../standards';

export const paramsCodec = t.strict({
  [queryStringParameters.expressionDoi]: queryStringParameters.expressionDoiCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
