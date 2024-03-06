import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../../src/domain-events';
import { update } from '../../../../src/write-side/resources/evaluation';
import { arbitraryEvaluationPublicationRecordedEvent, arbitraryEvaluationUpdatedEvent } from '../../../domain-events/evaluation-resource-events.helper';
import { EvaluationLocator } from '../../../../src/types/evaluation-locator';
import { EvaluationType } from '../../../../src/types/recorded-evaluation';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';

const evaluationRecordedWithType = (
  evaluationLocator: EvaluationLocator,
  evaluationType: EvaluationType | undefined,
) => ({
  ...arbitraryEvaluationPublicationRecordedEvent(),
  evaluationLocator,
  evaluationType,
});

const evaluationUpdatedWithType = (
  evaluationLocator: EvaluationLocator,
  evaluationType: EvaluationType | undefined,
) => constructEvent('EvaluationUpdated')({
  ...arbitraryEvaluationUpdatedEvent(),
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
        const generatedEvents = pipe(
          [
            evaluationRecordedWithType(evaluationLocator, 'review'),
          ],
          update(command),
          E.getOrElseW(shouldNotBeCalled),
        );

        it('raises exactly one event', () => {
          expect(generatedEvents).toHaveLength(1);
        });

        it('returns an EvaluationUpdated event', () => {
          expect(generatedEvents[0]).toBeDomainEvent('EvaluationUpdated', {
            evaluationLocator: command.evaluationLocator,
            evaluationType: command.evaluationType,
          });
        });
      });
    });

    describe('when the evaluation type has already been updated in the EvaluationUpdated event', () => {
      describe('and the command does not match the existing evaluation type', () => {
        const generatedEvents = pipe(
          [
            evaluationRecordedWithType(evaluationLocator, 'curation-statement'),
            evaluationUpdatedWithType(evaluationLocator, 'review'),
          ],
          update(command),
          E.getOrElseW(shouldNotBeCalled),
        );

        it('raises exactly one event', () => {
          expect(generatedEvents).toHaveLength(1);
        });

        it('returns an EvaluationUpdated event', () => {
          expect(generatedEvents[0]).toBeDomainEvent('EvaluationUpdated', {
            evaluationLocator: command.evaluationLocator,
            evaluationType: command.evaluationType,
          });
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
});
