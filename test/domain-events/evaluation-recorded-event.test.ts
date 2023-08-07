import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { evaluationRecordedEventCodec } from '../../src/domain-events/evaluation-recorded-event';
import { arbitraryEvaluationRecordedEvent } from './evaluation-recorded-event.helper';

describe('evaluation-recorded-event', () => {
  describe('when there is an event to be stored', () => {
    const evaluationRecordedEvent = arbitraryEvaluationRecordedEvent();
    const result = pipe(
      evaluationRecordedEvent,
      evaluationRecordedEventCodec.encode,
      evaluationRecordedEventCodec.decode,
    );

    it('encodes and decodes the event successfully', () => {
      expect(result).toStrictEqual(E.right(evaluationRecordedEvent));
    });
  });
});
