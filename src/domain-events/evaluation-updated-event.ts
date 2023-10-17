import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { evaluationLocatorCodec } from '../types/evaluation-locator';
import { evaluationTypeCodec } from './types/evaluation-type';

export const evaluationUpdatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('EvaluationUpdated'),
  date: tt.DateFromISOString,
  evaluationLocator: evaluationLocatorCodec,
  evaluationType: t.union([evaluationTypeCodec, t.undefined]),
  authors: t.union([t.readonlyArray(t.string), t.undefined]),
});
