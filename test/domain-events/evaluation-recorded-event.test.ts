import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { arbitraryEvaluationRecordedEvent } from './evaluation-recorded-event.helper';
import { EventOfType, constructEvent, domainEventCodec } from '../../src/domain-events';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryEvaluationLocator } from '../types/evaluation-locator.helper';
import { arbitraryDate } from '../helpers';
import { arbitraryEvaluationType } from '../types/evaluation-type.helper';
import { arbitraryGroupId } from '../types/group-id.helper';

const arbitraryEvaluationPublicationRecordedEvent = (): EventOfType<'EvaluationPublicationRecorded'> => constructEvent('EvaluationPublicationRecorded')({
  groupId: arbitraryGroupId(),
  articleId: arbitraryDoi(),
  evaluationLocator: arbitraryEvaluationLocator(),
  authors: [],
  publishedAt: arbitraryDate(),
  date: arbitraryDate(),
  evaluationType: arbitraryEvaluationType(),
});

describe('evaluation-recorded-event', () => {
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
