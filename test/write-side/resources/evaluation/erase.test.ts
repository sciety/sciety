import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { EvaluationLocator } from '../../../../src/types/evaluation-locator';
import { erase } from '../../../../src/write-side/resources/evaluation';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import {
  DomainEvent,
  constructEvent,
} from '../../../../src/domain-events';
import { arbitraryEvaluationRecordedEvent, evaluationRecordedHelper } from '../../../types/evaluation-recorded-event.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryDoi } from '../../../types/doi.helper';

const expectIncorrectlyRecordedEvaluationErasedEvent = (evaluationLocator: EvaluationLocator): unknown => (
  expect.objectContaining({
    evaluationLocator,
  })
);

describe('erase', () => {
  describe('when an evaluation has been incorrectly recorded', () => {
    const evaluationLocator = arbitraryEvaluationLocator();
    let eventsRaised: ReadonlyArray<DomainEvent>;

    beforeEach(() => {
      eventsRaised = pipe(
        [
          {
            ...arbitraryEvaluationRecordedEvent(),
            evaluationLocator,
          },
        ],
        erase({ evaluationLocator }),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('raises an IncorrectlyRecordedEvaluationErased event', () => {
      expect(eventsRaised).toStrictEqual([
        expectIncorrectlyRecordedEvaluationErasedEvent(evaluationLocator),
      ]);
    });
  });

  describe('when the evaluation has not been recorded', () => {
    let eventsRaised: ReadonlyArray<DomainEvent>;

    beforeEach(() => {
      eventsRaised = pipe(
        [],
        erase({ evaluationLocator: arbitraryEvaluationLocator() }),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('raises no event', () => {
      expect(eventsRaised).toStrictEqual([]);
    });
  });

  describe('when the evaluation has been recorded and erased', () => {
    const evaluationLocator = arbitraryEvaluationLocator();
    let eventsRaised: ReadonlyArray<DomainEvent>;

    beforeEach(() => {
      eventsRaised = pipe(
        [
          {
            ...arbitraryEvaluationRecordedEvent(),
            evaluationLocator,
          },
          constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator }),
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
    const evaluationLocator = arbitraryEvaluationLocator();
    let eventsRaised: ReadonlyArray<DomainEvent>;

    beforeEach(() => {
      eventsRaised = pipe(
        [
          evaluationRecordedHelper(
            arbitraryGroupId(),
            arbitraryDoi(),
            evaluationLocator,
            [],
            new Date(),
          ),
          constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator }),
          evaluationRecordedHelper(
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
        expectIncorrectlyRecordedEvaluationErasedEvent(evaluationLocator),
      ]);
    });
  });
});
