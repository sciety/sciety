import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { evaluationLocatorCodec } from '../types/evaluation-locator';

const eventType = 'IncorrectlyRecordedEvaluationErased';

export const incorrectlyRecordedEvaluationErasedEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal(eventType),
  date: tt.DateFromISOString,
  evaluationLocator: evaluationLocatorCodec,
});
