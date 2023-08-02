import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { EvaluationLocator } from '../../../../src/types/evaluation-locator';
import { erase } from '../../../../src/write-side/resources/evaluation';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';

import { arbitraryEvaluationPublicationRecordedEvent } from '../../../types/evaluation-recorded-event.helper';

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
          ...arbitraryEvaluationPublicationRecordedEvent(),
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
});
