import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../../domain-events/evaluation-publication-recorded-event.helper';
import { arbitraryEvaluationUpdatedEvent } from '../../../domain-events/evaluation-updated-event.helper';
import * as evaluationResource from '../../../../src/write-side/resources/evaluation';
import { arbitraryUpdateEvaluationCommand } from '../../commands/update-evaluation-command.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { UpdateEvaluationCommand } from '../../../../src/write-side/commands';
import { EvaluationType } from '../../../../src/types/recorded-evaluation';
import { arbitraryString } from '../../../helpers';

const expectEvent = (fields: Record<string, unknown>) => ({
  id: expect.any(String),
  date: expect.any(Date),
  type: 'EvaluationUpdated',
  evaluationLocator: undefined,
  evaluationType: undefined,
  authors: undefined,
  ...fields,
});

describe('update', () => {
  describe('when the evaluation publication has been recorded', () => {
    const evaluationLocator = arbitraryEvaluationLocator();

    describe('when passed a new value for a single attribute', () => {
      describe('and this evaluation has never been updated', () => {
        describe.each([
          ['evaluationType' as const, 'review' as EvaluationType],
          ['authors' as const, [arbitraryString()]],
        ])('%s', (attributeToBeChanged, newValue) => {
          const command: UpdateEvaluationCommand = {
            evaluationLocator,
            [attributeToBeChanged]: newValue,
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
      });

      describe('and this evaluation has previously been updated', () => {
        describe.each([
          ['evaluationType' as const, 'curation-statement' as EvaluationType, 'review' as EvaluationType],
          ['authors' as const, [], [arbitraryString()]],
        ])('%s', (attributeToBeChanged, previousUpdateValue, newUpdateValue) => {
          const command: UpdateEvaluationCommand = {
            evaluationLocator,
            [attributeToBeChanged]: newUpdateValue,
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
                [attributeToBeChanged]: previousUpdateValue,
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
        ['evaluationType'],
      ])('%s', (attributeToBeChanged) => {
        describe('and this evaluation\'s details have never been updated', () => {
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
          const eventsRaised = pipe(
            [
              {
                ...arbitraryEvaluationPublicationRecordedEvent(),
                evaluationLocator,
                evaluationType: 'curation-statement',
              },
              {
                ...arbitraryEvaluationUpdatedEvent(),
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
      });
    });

    describe('when passed a new value for one attribute and an unchanged value for a different attribute', () => {
      describe.each([
        ['evaluationType' as const, 'authors' as const],
        ['authors' as const, 'evaluationType' as const],
      ])('new %s, existing %s', (attributeToBeChanged, unchangedAttribute) => {
        const newValue = arbitraryString();

        describe('and this evaluation has never been updated', () => {
          const evaluationPublicationRecorded = {
            ...arbitraryEvaluationPublicationRecordedEvent(),
            evaluationLocator,
            evaluationType: 'curation-statement' as const,
          };
          const executeUpdateAction = (command: UpdateEvaluationCommand) => pipe(
            [
              evaluationPublicationRecorded,
            ],
            evaluationResource.update(command),
            E.getOrElseW(shouldNotBeCalled),
          );
          const eventsRaised = executeUpdateAction({
            evaluationLocator,
            [attributeToBeChanged]: newValue,
            [unchangedAttribute]: evaluationPublicationRecorded[unchangedAttribute],
          });

          it(`raises an event to only update the ${attributeToBeChanged}`, () => {
            expect(eventsRaised).toStrictEqual([
              expectEvent({
                evaluationLocator,
                [attributeToBeChanged]: newValue,
              }),
            ]);
          });
        });

        describe(`and this evaluation's ${attributeToBeChanged} has previously been updated`, () => {
          it.todo(`raises an event to only update the ${attributeToBeChanged}`);
        });
      });
    });
  });
});
