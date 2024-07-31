import * as t from 'io-ts';
import * as EL from '../../../types/evaluation-locator';

export const paramsCodec = t.type({
  evaluationLocator: EL.evaluationLocatorCodec,
});
