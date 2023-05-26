import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { generate } from '../types/event-id';
import { EvaluationLocator, evaluationLocatorCodec } from '../types/evaluation-locator';

const eventType = 'IncorrectlyRecordedEvaluationErased';

export const incorrectlyRecordedEvaluationErasedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal(eventType),
  date: tt.DateFromISOString,
  evaluationLocator: evaluationLocatorCodec,
});

export type IncorrectlyRecordedEvaluationErasedEvent = t.TypeOf<typeof incorrectlyRecordedEvaluationErasedEventCodec>;

export const incorrectlyRecordedEvaluationErased = (
  evaluationLocator: EvaluationLocator,
  date: Date = new Date(),
): IncorrectlyRecordedEvaluationErasedEvent => ({
  id: generate(),
  type: eventType,
  date,
  evaluationLocator,
});
