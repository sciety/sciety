import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { EvaluationLocator } from '../../../../src/types/evaluation-locator';
import { erase } from '../../../../src/write-side/resources/evaluation';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import {
  constructEvent,
} from '../../../../src/domain-events';
import { arbitraryEvaluationRecordedEvent } from '../../../types/evaluation-recorded-event.helper';

const expectIncorrectlyRecordedEvaluationErasedEvent = (evaluationLocator: EvaluationLocator): unknown => (
  expect.objectContaining({
    evaluationLocator,
  })
);

describe('erase', () => {
  describe('when an evaluation has been incorrectly recorded', () => {
    const evaluationLocator = arbitraryEvaluationLocator();
    const eventsRaised = pipe(
      [
        {
          ...arbitraryEvaluationRecordedEvent(),
          evaluationLocator,
        },
      ],
      erase({ evaluationLocator }),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('raises an IncorrectlyRecordedEvaluationErased event', () => {
      expect(eventsRaised).toStrictEqual([
        expectIncorrectlyRecordedEvaluationErasedEvent(evaluationLocator),
      ]);
    });
  });

  describe('when the evaluation has not been recorded', () => {
    const eventsRaised = pipe(
      [],
      erase({ evaluationLocator: arbitraryEvaluationLocator() }),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('raises no event', () => {
      expect(eventsRaised).toStrictEqual([]);
    });
  });

  describe('when the evaluation has been recorded, erased and recorded again', () => {
    const evaluationLocator = arbitraryEvaluationLocator();
    const eventsRaised = pipe(
      [
        {
          ...arbitraryEvaluationRecordedEvent(),
          evaluationLocator,
        },
        constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator }),
        {
          ...arbitraryEvaluationRecordedEvent(),
          evaluationLocator,
        },
      ],
      erase({ evaluationLocator }),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('raises one IncorrectlyRecordedEvaluationErased event', () => {
      expect(eventsRaised).toStrictEqual([
        expectIncorrectlyRecordedEvaluationErasedEvent(evaluationLocator),
      ]);
    });
  });
});
