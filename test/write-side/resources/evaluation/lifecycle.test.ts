import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import {
  erase, update, recordPublication, recordRemoval,
} from '../../../../src/write-side/resources/evaluation';
import { arbitraryEvaluationType } from '../../../types/evaluation-type.helper';
import { arbitraryDate, arbitraryString } from '../../../helpers';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import * as A from '../enact';
import { RecordEvaluationPublicationCommand } from '../../../../src/write-side/commands';
import { evaluationResourceError } from '../../../../src/write-side/resources/evaluation/evaluation-resource-error';

describe('lifecycle', () => {
  describe('given no existing evaluation', () => {
    const initialState = A.of([]);
    const evaluationLocator = arbitraryEvaluationLocator();

    describe('record publication', () => {
      const mostRecentCommand: RecordEvaluationPublicationCommand = {
        groupId: arbitraryGroupId(),
        articleId: arbitraryArticleId(),
        evaluationLocator,
        publishedAt: arbitraryDate(),
        authors: [arbitraryString(), arbitraryString()],
        evaluationType: arbitraryEvaluationType(),
      };
      const outcome = pipe(
        initialState,
        A.last(recordPublication(mostRecentCommand)),
      );

      it('succeeds with a new event', () => {
        expect(outcome).toStrictEqual(E.right([expect.objectContaining({
          type: 'EvaluationPublicationRecorded',
          groupId: mostRecentCommand.groupId,
          articleId: mostRecentCommand.articleId,
          evaluationLocator: mostRecentCommand.evaluationLocator,
          publishedAt: mostRecentCommand.publishedAt,
          authors: mostRecentCommand.authors,
          evaluationType: mostRecentCommand.evaluationType,
        })]));
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
          evaluationType: 'review',
        })),
      );

      it('errors with does not exist', () => {
        expect(outcome).toStrictEqual(E.left(evaluationResourceError.doesNotExist));
      });
    });
  });

  describe('given a recorded evaluation publication', () => {
    const recordCommand = {
      groupId: arbitraryGroupId(),
      publishedAt: arbitraryDate(),
      evaluationLocator: arbitraryEvaluationLocator(),
      articleId: arbitraryArticleId(),
      authors: [],
    };

    const initialState = pipe(
      [],
      A.of,
      A.concat(recordPublication(recordCommand)),
    );

    describe('record publication', () => {
      const outcome = pipe(
        initialState,
        A.last(recordPublication(recordCommand)),
      );

      it('succeeds with no new events', () => {
        expect(outcome).toStrictEqual(E.right([]));
      });
    });

    describe('erase', () => {
      const outcome = pipe(
        initialState,
        A.last(erase({ evaluationLocator: recordCommand.evaluationLocator })),
      );

      it('succeeds with a new event', () => {
        expect(outcome).toStrictEqual(E.right([
          expect.objectContaining({
            type: 'IncorrectlyRecordedEvaluationErased',
            evaluationLocator: recordCommand.evaluationLocator,
          }),
        ]));
      });
    });

    describe('record removal', () => {
      const outcome = pipe(
        initialState,
        A.last(recordRemoval({ evaluationLocator: recordCommand.evaluationLocator })),
      );

      it('succeeds with a new event', () => {
        expect(outcome).toStrictEqual(E.right([
          expect.objectContaining({
            type: 'EvaluationRemovalRecorded',
            evaluationLocator: recordCommand.evaluationLocator,
          }),
        ]));
      });
    });

    describe('update', () => {
      const outcome = pipe(
        initialState,
        A.last(update({ evaluationLocator: recordCommand.evaluationLocator, evaluationType: 'review' })),
      );

      it('succeeds with a new event', () => {
        expect(outcome).toStrictEqual(E.right([
          expect.objectContaining({
            type: 'EvaluationUpdated',
            evaluationLocator: recordCommand.evaluationLocator,
            evaluationType: 'review',
          }),
        ]));
      });
    });
  });

  describe('given an erased evaluation', () => {
    const evaluationLocator = arbitraryEvaluationLocator();
    const recordCommand = {
      groupId: arbitraryGroupId(),
      publishedAt: arbitraryDate(),
      evaluationLocator,
      articleId: arbitraryArticleId(),
      authors: [],
    };

    const initialState = pipe(
      [],
      A.of,
      A.concat(recordPublication(recordCommand)),
      A.concat(erase({ evaluationLocator })),
    );

    describe('record publication', () => {
      const mostRecentCommand = {
        groupId: arbitraryGroupId(),
        publishedAt: arbitraryDate(),
        evaluationLocator,
        articleId: arbitraryArticleId(),
        authors: [],
        evaluationType: arbitraryEvaluationType(),
      };
      const outcome = pipe(
        initialState,
        A.last(recordPublication(mostRecentCommand)),
      );

      it('succeeds with a new event', () => {
        expect(outcome).toStrictEqual(E.right([expect.objectContaining({
          type: 'EvaluationPublicationRecorded',
          groupId: mostRecentCommand.groupId,
          articleId: mostRecentCommand.articleId,
          evaluationLocator,
          publishedAt: mostRecentCommand.publishedAt,
          authors: mostRecentCommand.authors,
          evaluationType: mostRecentCommand.evaluationType,
        })]));
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
    const evaluation = {
      groupId: arbitraryGroupId(),
      publishedAt: arbitraryDate(),
      evaluationLocator,
      articleId: arbitraryArticleId(),
      authors: [],
    };
    const initialState = pipe(
      [],
      A.of,
      A.concat(recordPublication(evaluation)),
      A.concat(recordRemoval({ evaluationLocator })),
    );

    describe('record publication', () => {
      const outcome = pipe(
        initialState,
        A.last(recordPublication(evaluation)),
      );

      it('errors with previously removed, cannot record', () => {
        expect(outcome).toStrictEqual(E.left(evaluationResourceError.previouslyRemovedCannotRecord));
      });
    });

    describe('erase', () => {
      const outcome = pipe(
        initialState,
        A.last(erase({ evaluationLocator })),
      );

      it('succeeds with a new event', () => {
        expect(outcome).toStrictEqual(E.right([
          expect.objectContaining({
            type: 'IncorrectlyRecordedEvaluationErased',
            evaluationLocator,
          }),
        ]));
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
      const outcome = pipe(
        initialState,
        A.last(update({ evaluationLocator, evaluationType: 'review' })),
      );

      it('errors with previously removed, cannot update', () => {
        expect(outcome).toStrictEqual(E.left(evaluationResourceError.previouslyRemovedCannotUpdate));
      });
    });
  });
});
