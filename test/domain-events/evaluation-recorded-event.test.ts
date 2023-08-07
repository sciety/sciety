import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { evaluationRecordedEventCodec } from '../../src/domain-events/evaluation-recorded-event';
import { arbitraryEvaluationRecordedEvent } from './evaluation-recorded-event.helper';
import { EventOfType, constructEvent } from '../../src/domain-events';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryEvaluationLocator } from '../types/evaluation-locator.helper';
import { arbitraryDate } from '../helpers';
import { arbitraryEvaluationType } from '../types/evaluation-type.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { evaluationPublicationRecordedEventCodec } from '../../src/domain-events/evaluation-publication-recorded-event';

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
  describe('when there is a legacy event to be stored', () => {
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

  describe('when there is a current event to be stored', () => {
    const evaluationPublicationRecordedEvent = arbitraryEvaluationPublicationRecordedEvent();
    const result = pipe(
      evaluationPublicationRecordedEvent,
      evaluationPublicationRecordedEventCodec.encode,
      evaluationPublicationRecordedEventCodec.decode,
    );

    it('encodes and decodes the event successfully', () => {
      expect(result).toStrictEqual(E.right(evaluationPublicationRecordedEvent));
    });
  });
});
