import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { evaluationLocatorCodec } from '../types/evaluation-locator';

export const evaluationRemovedByGroupEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('EvaluationRemovedByGroup'),
  date: tt.DateFromISOString,
  evaluationLocator: evaluationLocatorCodec,
});
