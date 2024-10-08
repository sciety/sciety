import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { queryStringParameters } from '../../../../standards';

export const paramsCodec = t.type({
  [queryStringParameters.query]: queryStringParameters.queryCodec,
  [queryStringParameters.cursor]: queryStringParameters.cursorCodec,
  [queryStringParameters.page]: tt.optionFromNullable(tt.NumberFromString),
  [queryStringParameters.includeUnevaluatedPreprints]: queryStringParameters.includeUnevaluatedPreprintsCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
