import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { evaluationLocatorCodec } from '../types/evaluation-locator';

export const evaluationRemovalRecordedEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal('EvaluationRemovalRecorded'),
  date: tt.DateFromISOString,
  evaluationLocator: evaluationLocatorCodec,
  reason: t.literal('published-on-incorrect-article'),
});
