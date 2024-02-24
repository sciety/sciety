import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString.js';
import { evaluationLocatorCodec } from '../types/evaluation-locator.js';

const eventType = 'IncorrectlyRecordedEvaluationErased';

export const incorrectlyRecordedEvaluationErasedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal(eventType),
  date: tt.DateFromISOString,
  evaluationLocator: evaluationLocatorCodec,
});
