import * as t from 'io-ts';
import * as EL from '../../../types/evaluation-locator';

export const paramsCodec = t.type({
  reviewid: EL.evaluationLocatorCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
