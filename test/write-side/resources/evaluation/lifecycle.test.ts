import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../../src/domain-events';
import {
  erase, update, recordPublication, recordRemoval,
} from '../../../../src/write-side/resources/evaluation';
import { evaluationResourceError } from '../../../../src/write-side/resources/evaluation/evaluation-resource-error';
import { arbitraryEvaluationType } from '../../../domain-events/types/evaluation-type.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../commands/record-evaluation-publication-command.helper';
import { arbitraryUpdateEvaluationCommand } from '../../commands/update-evaluation-command.helper';
import * as A from '../enact';

describe('lifecycle', () => {
  describe('given no existing evaluation', () => {
    const initialState = A.of([]);
    const evaluationLocator = arbitraryEvaluationLocator();

    describe('record publication', () => {
      const mostRecentCommand = arbitraryRecordEvaluationPublicationCommand();
      let eventsRaised: ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        eventsRaised = pipe(
          initialState,
          A.last(recordPublication(mostRecentCommand)),
          E.getOrElseW(shouldNotBeCalled),
        );
      });

      it('causes a state change in which the evaluation\'s publication is recorded', () => {
        expect(eventsRaised).toHaveLength(1);
        expect(eventsRaised[0]).toBeDomainEvent('EvaluationPublicationRecorded', {
          groupId: mostRecentCommand.groupId,
          articleId: mostRecentCommand.expressionDoi,
          evaluationLocator: mostRecentCommand.evaluationLocator,
          publishedAt: mostRecentCommand.publishedAt,
          authors: mostRecentCommand.authors,
          evaluationType: mostRecentCommand.evaluationType,
        });
      });
    });

    describe('erase', () => {
      const outcome = pipe(
        initialState,
        A.concat(erase({ evaluationLocator })),
      );

      it('rejects the command with "Evaluation does not exist"', () => {
        expect(outcome).toStrictEqual(E.left(evaluationResourceError.doesNotExist));
      });
    });

    describe('record removal', () => {
      const outcome = pipe(
        initialState,
        A.concat(recordRemoval({ evaluationLocator })),
      );

      it('rejects the command with "Evaluation does not exist"', () => {
        expect(outcome).toStrictEqual(E.left(evaluationResourceError.doesNotExist));
      });
    });

    describe('update', () => {
      const outcome = pipe(
        initialState,
        A.concat(update({
          evaluationLocator,
          evaluationType: arbitraryEvaluationType(),
        })),
      );

      it('rejects the command with "Evaluation does not exist"', () => {
        expect(outcome).toStrictEqual(E.left(evaluationResourceError.doesNotExist));
      });
    });
  });

  describe('given a recorded evaluation publication', () => {
    const initialCommand = arbitraryRecordEvaluationPublicationCommand();
    const initialState = pipe(
      [],
      A.of,
      A.concat(recordPublication(initialCommand)),
    );

    describe('record publication', () => {
      const outcome = pipe(
        initialState,
        A.last(recordPublication(initialCommand)),
      );

      it('accepts the command and causes no state change', () => {
        expect(outcome).toStrictEqual(E.right([]));
      });
    });

    describe('erase', () => {
      let eventsRaised: ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        eventsRaised = pipe(
          initialState,
          A.last(erase({ evaluationLocator: initialCommand.evaluationLocator })),
          E.getOrElseW(shouldNotBeCalled),
        );
      });

      it('causes a state change in which the incorrect recording of the evaluation is erased', () => {
        expect(eventsRaised).toHaveLength(1);
        expect(eventsRaised[0]).toBeDomainEvent('IncorrectlyRecordedEvaluationErased', {
          evaluationLocator: initialCommand.evaluationLocator,
        });
      });
    });

    describe('record removal', () => {
      let eventsRaised: ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        eventsRaised = pipe(
          initialState,
          A.last(recordRemoval({ evaluationLocator: initialCommand.evaluationLocator })),
          E.getOrElseW(shouldNotBeCalled),
        );
      });

      it('causes a state change in which the removal of the evaluation is recorded', () => {
        expect(eventsRaised).toHaveLength(1);
        expect(eventsRaised[0]).toBeDomainEvent('EvaluationRemovalRecorded', {
          evaluationLocator: initialCommand.evaluationLocator,
        });
      });
    });

    describe('update', () => {
      const mostRecentCommand = {
        ...arbitraryUpdateEvaluationCommand(),
        evaluationLocator: initialCommand.evaluationLocator,
      };
      let eventsRaised: ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        eventsRaised = pipe(
          initialState,
          A.last(update(mostRecentCommand)),
          E.getOrElseW(shouldNotBeCalled),
        );
      });

      it('causes a state change in which the evaluation is updated', () => {
        expect(eventsRaised).toHaveLength(1);
        expect(eventsRaised[0]).toBeDomainEvent('EvaluationUpdated', {
          evaluationLocator: mostRecentCommand.evaluationLocator,
          evaluationType: mostRecentCommand.evaluationType,
        });
      });
    });
  });

  describe('given an erased evaluation', () => {
    const evaluationLocator = arbitraryEvaluationLocator();
    const recordCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      evaluationLocator,
    };

    const initialState = pipe(
      [],
      A.of,
      A.concat(recordPublication(recordCommand)),
      A.concat(erase({ evaluationLocator })),
    );

    describe('record publication', () => {
      const mostRecentCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        evaluationLocator,
      };
      let eventsRaised: ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        eventsRaised = pipe(
          initialState,
          A.last(recordPublication(mostRecentCommand)),
          E.getOrElseW(shouldNotBeCalled),
        );
      });

      it('causes a state change in which the publication of the evaluation is recorded', () => {
        expect(eventsRaised).toHaveLength(1);
        expect(eventsRaised[0]).toBeDomainEvent('EvaluationPublicationRecorded', {
          groupId: mostRecentCommand.groupId,
          articleId: mostRecentCommand.expressionDoi,
          evaluationLocator,
          publishedAt: mostRecentCommand.publishedAt,
          authors: mostRecentCommand.authors,
          evaluationType: mostRecentCommand.evaluationType,
        });
      });
    });

    describe('erase', () => {
      const outcome = pipe(
        initialState,
        A.last(erase({ evaluationLocator })),
      );

      it('accepts the command and causes no state change', () => {
        expect(outcome).toStrictEqual(E.right([]));
      });
    });

    describe('record removal', () => {
      const outcome = pipe(
        initialState,
        A.last(recordRemoval({ evaluationLocator })),
      );

      it('rejects the command with "Evaluation does not exist"', () => {
        expect(outcome).toStrictEqual(E.left(evaluationResourceError.doesNotExist));
      });
    });

    describe('update', () => {
      const outcome = pipe(
        initialState,
        A.concat(update({
          evaluationLocator,
          evaluationType: arbitraryEvaluationType(),
        })),
      );

      it('rejects the command with "Evaluation does not exist"', () => {
        expect(outcome).toStrictEqual(E.left(evaluationResourceError.doesNotExist));
      });
    });
  });

  describe('given a recorded evaluation removal', () => {
    const evaluationLocator = arbitraryEvaluationLocator();
    const initialRecordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      evaluationLocator,
    };
    const initialState = pipe(
      [],
      A.of,
      A.concat(recordPublication(initialRecordEvaluationPublicationCommand)),
      A.concat(recordRemoval({ evaluationLocator })),
    );

    describe('record publication', () => {
      const outcome = pipe(
        initialState,
        A.last(recordPublication(initialRecordEvaluationPublicationCommand)),
      );

      it('rejects the command with "This evaluation has been removed and cannot be recorded again"', () => {
        expect(outcome).toStrictEqual(E.left(evaluationResourceError.previouslyRemovedCannotRecord));
      });
    });

    describe('erase', () => {
      let eventsRaised: ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        eventsRaised = pipe(
          initialState,
          A.last(erase({ evaluationLocator })),
          E.getOrElseW(shouldNotBeCalled),
        );
      });

      it('causes a state change in which the incorrect recording of the evaluation is erased', () => {
        expect(eventsRaised).toHaveLength(1);
        expect(eventsRaised[0]).toBeDomainEvent('IncorrectlyRecordedEvaluationErased', {
          evaluationLocator,
        });
      });
    });

    describe('record removal', () => {
      const outcome = pipe(
        initialState,
        A.last(recordRemoval({ evaluationLocator })),
      );

      it('accepts the command and causes no state change', () => {
        expect(outcome).toStrictEqual(E.right([]));
      });
    });

    describe('update', () => {
      const mostRecentCommand = {
        ...arbitraryUpdateEvaluationCommand(),
        evaluationLocator,
      };
      const outcome = pipe(
        initialState,
        A.last(update(mostRecentCommand)),
      );

      it('rejects the command with "This evaluation has been removed and cannot be updated"', () => {
        expect(outcome).toStrictEqual(E.left(evaluationResourceError.previouslyRemovedCannotUpdate));
      });
    });
  });
});
