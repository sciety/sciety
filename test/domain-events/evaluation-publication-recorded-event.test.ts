import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { arbitraryEvaluationPublicationRecordedEvent, arbitraryEvaluationRecordedEvent } from './evaluation-publication-recorded-event.helper';
import { domainEventCodec } from '../../src/domain-events';

describe('evaluation-publication-recorded-event', () => {
  describe('when there is a legacy event to be loaded', () => {
    const evaluationRecordedEvent = arbitraryEvaluationRecordedEvent();
    const result = pipe(
      evaluationRecordedEvent,
      domainEventCodec.encode,
      domainEventCodec.decode,
    );

    it.skip('encodes and decodes the event successfully', () => {
      expect(result).toStrictEqual(E.right({
        ...evaluationRecordedEvent,
        type: 'EvaluationPublicationRecorded',
      }));
    });
  });

  describe('when there is a current event to be loaded', () => {
    const evaluationPublicationRecordedEvent = arbitraryEvaluationPublicationRecordedEvent();
    const result = pipe(
      evaluationPublicationRecordedEvent,
      domainEventCodec.encode,
      domainEventCodec.decode,
    );

    it('encodes and decodes the event successfully', () => {
      expect(result).toStrictEqual(E.right(evaluationPublicationRecordedEvent));
    });
  });
});
