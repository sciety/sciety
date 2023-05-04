import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { erase } from '../../../../src/write-side/resources/evaluation';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryReviewId } from '../../../types/review-id.helper';
import {
  DomainEvent,
  evaluationRecorded,
  incorrectlyRecordedEvaluationErased,
} from '../../../../src/domain-events';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryDoi } from '../../../types/doi.helper';

describe('erase', () => {
  describe('when an evaluation has been incorrectly recorded', () => {
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

    it('raises an IncorrectlyRecordedEvaluationErased event', () => {
      expect(eventsRaised).toStrictEqual([
        expect.objectContaining({
          evaluationLocator,
        }),
      ]);
    });
  });

  describe('when the evaluation has not been recorded', () => {
    let eventsRaised: ReadonlyArray<DomainEvent>;

    beforeEach(() => {
      eventsRaised = pipe(
        [],
        erase({ evaluationLocator: arbitraryReviewId() }),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('raises no event', () => {
      expect(eventsRaised).toStrictEqual([]);
    });
  });

  describe('when the evaluation has been recorded and erased', () => {
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
          incorrectlyRecordedEvaluationErased(evaluationLocator),
        ],
        erase({ evaluationLocator }),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('raises no event', () => {
      expect(eventsRaised).toStrictEqual([]);
    });
  });

  describe('when the evaluation has been recorded, erased and recorded again', () => {
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
          incorrectlyRecordedEvaluationErased(evaluationLocator),
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

    it('raises one IncorrectlyRecordedEvaluationErased event', () => {
      expect(eventsRaised).toStrictEqual([
        expect.objectContaining({
          evaluationLocator,
        }),
      ]);
    });
  });
});
