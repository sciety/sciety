import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../../domain-events/evaluation-publication-recorded-event.helper';
import { arbitraryEvaluationUpdatedEvent } from '../../../domain-events/evaluation-updated-event.helper';
import * as evaluationResource from '../../../../src/write-side/resources/evaluation';
import { arbitraryUpdateEvaluationCommand } from '../../commands/update-evaluation-command.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { UpdateEvaluationCommand } from '../../../../src/write-side/commands';

const expectEvent = (fields: Record<string, unknown>) => ({
  id: expect.any(String),
  date: expect.any(Date),
  type: 'EvaluationUpdated',
  evaluationLocator: undefined,
  evaluationType: undefined,
  ...fields,
});

describe('update', () => {
  describe('when the evalution publication has been recorded', () => {
    describe('when passed a new value for a single attribute', () => {
      describe.each([
        ['evaluationType' as const],
        // ['authors'],
      ])('%s', (attributeToBeChanged) => {
        describe('and this evaluation has never been updated', () => {
          const evaluationLocator = arbitraryEvaluationLocator();
          const command: UpdateEvaluationCommand = {
            ...arbitraryUpdateEvaluationCommand(),
            evaluationLocator,
            evaluationType: 'review',
          };
          const eventsRaised = pipe(
            [
              {
                ...arbitraryEvaluationPublicationRecordedEvent(),
                evaluationLocator,
                evaluationType: undefined,
              },
            ],
            evaluationResource.update(command),
            E.getOrElseW(shouldNotBeCalled),
          );

          it(`raises an event to update the evaluation ${attributeToBeChanged}`, () => {
            expect(eventsRaised).toStrictEqual([
              expectEvent({
                evaluationLocator: command.evaluationLocator,
                [attributeToBeChanged]: command[attributeToBeChanged],
              }),
            ]);
          });
        });

        describe(`and this evaluation's ${attributeToBeChanged} has previously been updated`, () => {
          const evaluationLocator = arbitraryEvaluationLocator();
          const command: UpdateEvaluationCommand = {
            ...arbitraryUpdateEvaluationCommand(),
            evaluationLocator,
            evaluationType: 'review',
          };
          const eventsRaised = pipe(
            [
              {
                ...arbitraryEvaluationPublicationRecordedEvent(),
                evaluationLocator,
              },
              {
                ...arbitraryEvaluationUpdatedEvent(),
                evaluationLocator,
                [attributeToBeChanged]: 'author-response',
              },
            ],
            evaluationResource.update(command),
            E.getOrElseW(shouldNotBeCalled),
          );

          it(`raises an event to update the evaluation ${attributeToBeChanged}`, () => {
            expect(eventsRaised).toStrictEqual([
              expectEvent({
                evaluationLocator: command.evaluationLocator,
                [attributeToBeChanged]: command[attributeToBeChanged],
              }),
            ]);
          });
        });
      });
    });

    describe('when passed an unchanged value for a single attribute', () => {
      describe.each([
        ['type'],
      ])('%s', (attributeToBeChanged) => {
        describe('and this evaluation\'s details have never been updated', () => {
          const evaluationLocator = arbitraryEvaluationLocator();
          const eventsRaised = pipe(
            [
              {
                ...arbitraryEvaluationPublicationRecordedEvent(),
                evaluationLocator,
                evaluationType: 'review',
              },
            ],
            evaluationResource.update({
              ...arbitraryUpdateEvaluationCommand(),
              evaluationLocator,
              evaluationType: 'review',
            }),
            E.getOrElseW(shouldNotBeCalled),
          );

          it('raises no events', () => {
            expect(eventsRaised).toStrictEqual([]);
          });
        });

        describe(`and this evaluation's ${attributeToBeChanged} has previously been updated`, () => {
          it.todo('raises no events');
        });
      });
    });
  });

  describe('when the evaluation publication has not been recorded', () => {
    describe('when passed any command', () => {
      it.todo('returns an error');
    });
  });

  describe('when an EvaluationUpdated event exists without a previous EvaluationPublicationRecorded event', () => {
    it.todo('returns an error');
  });

  describe('when an EvaluationUpdated event is followed by a EvaluationPublicationRecorded event', () => {
    it.todo('returns an error');
  });
});
