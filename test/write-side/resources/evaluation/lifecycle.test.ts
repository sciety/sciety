import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../../src/domain-events';
import {
  erase, update, recordPublication, recordRemoval,
} from '../../../../src/write-side/resources/evaluation';
import { evaluationResourceError } from '../../../../src/write-side/resources/evaluation/evaluation-resource-error';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryEvaluationType } from '../../../types/evaluation-type.helper';
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

      it('raises a single event', () => {
        expect(eventsRaised).toHaveLength(1);
      });

      it('raises the correct event', () => {
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

      it('errors with does not exist', () => {
        expect(outcome).toStrictEqual(E.left(evaluationResourceError.doesNotExist));
      });
    });

    describe('record removal', () => {
      const outcome = pipe(
        initialState,
        A.concat(recordRemoval({ evaluationLocator })),
      );

      it('errors with does not exist', () => {
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

      it('errors with does not exist', () => {
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

      it('succeeds with no new events', () => {
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

      it('raises a single event', () => {
        expect(eventsRaised).toHaveLength(1);
      });

      it('raises the correct event', () => {
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

      it('raises a single event', () => {
        expect(eventsRaised).toHaveLength(1);
      });

      it('raises the correct event', () => {
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

      it('raises a single event', () => {
        expect(eventsRaised).toHaveLength(1);
      });

      it('raises the correct event', () => {
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

      it('raises a single event', () => {
        expect(eventsRaised).toHaveLength(1);
      });

      it('raises the correct event', () => {
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

      it('succeeds with no new events', () => {
        expect(outcome).toStrictEqual(E.right([]));
      });
    });

    describe('record removal', () => {
      const outcome = pipe(
        initialState,
        A.last(recordRemoval({ evaluationLocator })),
      );

      it('errors with does not exist', () => {
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

      it('errors with does not exist', () => {
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

      it('errors with previously removed, cannot record', () => {
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

      it('raises a single event', () => {
        expect(eventsRaised).toHaveLength(1);
      });

      it('raises the correct event', () => {
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

      it('succeeds with no new events', () => {
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

      it('errors with previously removed, cannot update', () => {
        expect(outcome).toStrictEqual(E.left(evaluationResourceError.previouslyRemovedCannotUpdate));
      });
    });
  });
});
