import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { erase } from '../../../../src/write-side/resources/evaluation';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryReviewId } from '../../../types/review-id.helper';
import { DomainEvent, evaluationRecorded } from '../../../../src/domain-events';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryDoi } from '../../../types/doi.helper';

describe('erase', () => {
  describe('when an evaluation has been incorrectly recorded', () => {
    describe('and the action is executed', () => {
      const evaluationLocator = arbitraryReviewId();
      let eventsRaised: ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        eventsRaised = pipe(
          [
            evaluationRecorded(
              arbitraryGroupId(),
              arbitraryDoi(),
              evaluationLocator,
              [],
              new Date(),
            ),
          ],
          erase({ evaluationLocator }),
          E.getOrElseW(shouldNotBeCalled),
        );
      });

      it.failing('raises an IncorrectlyRecordedEvaluationErased event', () => {
        expect(eventsRaised).toStrictEqual([
          expect.objectContaining({
            evaluationLocator,
          }),
        ]);
      });
    });
  });

  describe('when evaluation has not been recorded', () => {
    describe('and the action is executed', () => {
      it.todo('raises no event');
    });
  });
});
