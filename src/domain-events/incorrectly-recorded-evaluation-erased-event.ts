import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { generate } from '../types/event-id';
import { ReviewId, reviewIdCodec } from '../types/review-id';

export const incorrectlyRecordedEvaluationErasedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('IncorrectlyRecordedEvaluationErased'),
  date: tt.DateFromISOString,
  evaluationLocator: reviewIdCodec,
});

export type IncorrectlyRecordedEvaluationErasedEvent = t.TypeOf<typeof incorrectlyRecordedEvaluationErasedEventCodec>;

export const isIncorrectlyRecordedEvaluationErasedEvent = (event: { type: string }):
  event is IncorrectlyRecordedEvaluationErasedEvent => event.type === 'IncorrectlyRecordedEvaluationErased';

export const incorrectlyRecordedEvaluationErased = (
  evaluationLocator: ReviewId,
  date: Date = new Date(),
): IncorrectlyRecordedEvaluationErasedEvent => ({
  id: generate(),
  type: 'IncorrectlyRecordedEvaluationErased',
  date,
  evaluationLocator,
});
