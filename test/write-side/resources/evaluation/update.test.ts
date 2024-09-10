import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../../src/domain-events';
import { EvaluationType } from '../../../../src/types/evaluation-type';
import { UpdateEvaluationCommand } from '../../../../src/write-side/commands';
import * as evaluationResource from '../../../../src/write-side/resources/evaluation';
import { arbitraryEvaluationPublicationRecordedEvent, arbitraryEvaluationUpdatedEvent } from '../../../domain-events/evaluation-resource-events.helper';
import { arbitraryDate, arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryUpdateEvaluationCommand } from '../../commands/update-evaluation-command.helper';

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
          let eventsRaised: ReadonlyArray<DomainEvent>;

          beforeEach(() => {
            eventsRaised = pipe(
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
          });

          it(`causes a state change in which only the evaluation's ${attributeToBeChanged} is updated`, () => {
            expect(eventsRaised).toHaveLength(1);
            expect(eventsRaised[0]).toBeDomainEvent('EvaluationUpdated', {
              evaluationType: undefined,
              evaluationLocator: command.evaluationLocator,
              [attributeToBeChanged]: command[attributeToBeChanged],
            });
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
          let eventsRaised: ReadonlyArray<DomainEvent>;

          beforeEach(() => {
            eventsRaised = pipe(
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
          });

          it(`causes a state change in which only the evaluation's ${attributeToBeChanged} is updated`, () => {
            expect(eventsRaised).toHaveLength(1);
            expect(eventsRaised[0]).toBeDomainEvent('EvaluationUpdated', {
              evaluationType: undefined,
              authors: undefined,
              evaluationLocator: command.evaluationLocator,
              [attributeToBeChanged]: command[attributeToBeChanged],
            });
          });
        });
      });
    });

    describe('when passed an unchanged value for a single attribute', () => {
      describe.each([
        ['evaluationType'],
      ])('%s', (attributeToBeChanged) => {
        describe('and this evaluation\'s details have never been updated', () => {
          let eventsRaised: ReadonlyArray<DomainEvent>;

          beforeEach(() => {
            eventsRaised = pipe(
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
                authors: undefined,
              }),
              E.getOrElseW(shouldNotBeCalled),
            );
          });

          it('accepts the command and causes no state change', () => {
            expect(eventsRaised).toStrictEqual([]);
          });
        });

        describe(`and this evaluation's ${attributeToBeChanged} has previously been updated`, () => {
          let eventsRaised: ReadonlyArray<DomainEvent>;

          beforeEach(() => {
            eventsRaised = pipe(
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
                authors: undefined,
              }),
              E.getOrElseW(shouldNotBeCalled),
            );
          });

          it('accepts the command and causes no state change', () => {
            expect(eventsRaised).toStrictEqual([]);
          });
        });
      });
    });

    describe('when passed a new value for one attribute and an unchanged value for a different attribute', () => {
      describe.each([
        ['evaluationType' as const, 'curation-statement' as const, 'author-response' as const, 'authors' as const, [arbitraryString()]],
        ['authors' as const, [arbitraryString()], [arbitraryString()], 'evaluationType' as const, 'author-response' as const],
      ])('new %s, existing %s', (attributeToBeChanged, previousUpdateValue, newValue, unchangedAttribute, unchangingValue) => {
        describe('and this evaluation has never been updated', () => {
          const evaluationPublicationRecorded = {
            ...arbitraryEvaluationPublicationRecordedEvent(),
            evaluationLocator,
            evaluationType: 'review' as const,
            [unchangedAttribute]: unchangingValue,
          };
          let eventsRaised: ReadonlyArray<DomainEvent>;

          beforeEach(() => {
            eventsRaised = pipe(
              [
                evaluationPublicationRecorded,
              ],
              evaluationResource.update({
                evaluationLocator,
                [attributeToBeChanged]: newValue,
                [unchangedAttribute]: unchangingValue,
              } satisfies UpdateEvaluationCommand),
              E.getOrElseW(shouldNotBeCalled),
            );
          });

          it(`causes a state change in which only the evaluation's ${attributeToBeChanged} is updated`, () => {
            expect(eventsRaised).toHaveLength(1);
            expect(eventsRaised[0]).toBeDomainEvent('EvaluationUpdated', {
              evaluationType: undefined,
              authors: undefined,
              evaluationLocator,
              [attributeToBeChanged]: newValue,
            });
          });
        });

        describe(`and this evaluation's ${attributeToBeChanged} has previously been updated`, () => {
          const evaluationPublicationRecorded = {
            ...arbitraryEvaluationPublicationRecordedEvent(),
            evaluationLocator,
            evaluationType: 'review' as const,
            [unchangedAttribute]: unchangingValue,
          };
          let eventsRaised: ReadonlyArray<DomainEvent>;

          beforeEach(() => {
            eventsRaised = pipe(
              [
                evaluationPublicationRecorded,
                {
                  ...arbitraryEvaluationUpdatedEvent(),
                  evaluationLocator,
                  [unchangedAttribute]: undefined,
                  [attributeToBeChanged]: previousUpdateValue,
                },
              ],
              evaluationResource.update({
                evaluationLocator,
                [attributeToBeChanged]: newValue,
                [unchangedAttribute]: unchangingValue,
              } satisfies UpdateEvaluationCommand),
              E.getOrElseW(shouldNotBeCalled),
            );
          });

          it(`causes a state change in which only the evaluation's ${attributeToBeChanged} is updated`, () => {
            expect(eventsRaised).toHaveLength(1);
            expect(eventsRaised[0]).toBeDomainEvent('EvaluationUpdated', {
              evaluationType: undefined,
              authors: undefined,
              evaluationLocator,
              [attributeToBeChanged]: newValue,
            });
          });
        });
      });
    });

    describe('when passed an issuedAt', () => {
      const issuedAt = arbitraryDate();
      let eventsRaised: ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        eventsRaised = pipe(
          [
            {
              ...arbitraryEvaluationPublicationRecordedEvent(),
              evaluationLocator,
            },
          ],
          evaluationResource.update({
            ...arbitraryUpdateEvaluationCommand(),
            evaluationLocator,
            issuedAt,
          }),
          E.getOrElseW(shouldNotBeCalled),
        );
      });

      it('causes a state change in which the evaluation is updated, the date of such update being the date supplied in the command', () => {
        expect(eventsRaised).toHaveLength(1);
        expect(eventsRaised[0]).toBeDomainEvent('EvaluationUpdated', {
          date: issuedAt,
        });
      });
    });
  });
});
