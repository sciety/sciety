import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../../src/domain-events';
import { update } from '../../../../src/write-side/resources/evaluation';
import { evaluationRecordedHelper } from '../../../types/evaluation-recorded-event.helper';
import { EvaluationLocator } from '../../../../src/types/evaluation-locator';
import { EvaluationType } from '../../../../src/types/recorded-evaluation';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryDoi } from '../../../types/doi.helper';
import { arbitraryString } from '../../../helpers';

const evaluationRecordedWithType = (
  evaluationLocator: EvaluationLocator,
  evaluationType: EvaluationType | undefined,
) => evaluationRecordedHelper(
  arbitraryGroupId(),
  arbitraryDoi(),
  evaluationLocator,
  [arbitraryString(), arbitraryString()],
  new Date(),
  new Date(),
  evaluationType,
);

const evaluationUpdatedWithType = (
  evaluationLocator: EvaluationLocator,
  evaluationType: EvaluationType | undefined,
) => constructEvent('EvaluationUpdated')({
  evaluationLocator,
  evaluationType,
});

describe('update', () => {
  describe('when the evaluation locator has been recorded', () => {
    const evaluationLocator = arbitraryEvaluationLocator();
    const command = {
      evaluationLocator,
      evaluationType: 'author-response' as const,
    };

    describe('when the evaluation type has been recorded in the EvaluationRecorded event', () => {
      describe('and the command matches the existing evaluation type', () => {
        const existingEvents = [
          evaluationRecordedWithType(evaluationLocator, 'author-response'),
        ];
        const generatedEvents = pipe(
          existingEvents,
          update(command),
        );

        it('returns no events', () => {
          expect(generatedEvents).toStrictEqual(E.right([]));
        });
      });

      describe('and the command does not match the existing evaluation type', () => {
        const existingEvents = [
          evaluationRecordedWithType(evaluationLocator, 'review'),
        ];
        const generatedEvents = pipe(
          existingEvents,
          update(command),
        );

        it('returns an EvaluationUpdated event', () => {
          expect(generatedEvents).toStrictEqual(E.right([expect.objectContaining({
            type: 'EvaluationUpdated',
            evaluationLocator: command.evaluationLocator,
            evaluationType: command.evaluationType,
          })]));
        });
      });
    });

    describe('when the evaluation type has already been updated in the EvaluationUpdated event', () => {
      describe('and the command does not match the existing evaluation type', () => {
        const existingEvents = [
          evaluationRecordedWithType(evaluationLocator, 'curation-statement'),
          evaluationUpdatedWithType(evaluationLocator, 'review'),
        ];
        const generatedEvents = pipe(
          existingEvents,
          update(command),
        );

        it('returns an EvaluationUpdated event', () => {
          expect(generatedEvents).toStrictEqual(E.right([expect.objectContaining({
            type: 'EvaluationUpdated',
            evaluationLocator: command.evaluationLocator,
            evaluationType: command.evaluationType,
          })]));
        });
      });

      describe('and the command matches the existing evaluation type', () => {
        const existingEvents = [
          evaluationRecordedWithType(evaluationLocator, 'curation-statement'),
          evaluationUpdatedWithType(evaluationLocator, command.evaluationType),
        ];
        const generatedEvents = pipe(
          existingEvents,
          update(command),
        );

        it('returns no events', () => {
          expect(generatedEvents).toStrictEqual(E.right([]));
        });
      });
    });
  });

  describe('when the evaluation locator has not been recorded', () => {
    const command = {
      evaluationLocator: arbitraryEvaluationLocator(),
      evaluationType: 'author-response' as const,
    };

    const result = pipe(
      [],
      update(command),
    );

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
