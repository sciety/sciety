import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import {
  erase, update, record, recordRemoval,
} from '../../../../src/write-side/resources/evaluation';
import { arbitraryEvaluationType } from '../../../types/evaluation-type.helper';
import { arbitraryDate, arbitraryString } from '../../../helpers';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import * as A from '../enact';
import { RecordEvaluationCommand } from '../../../../src/write-side/commands';

describe('lifecycle', () => {
  describe('given no existing evaluation', () => {
    const initialState = A.of([]);

    describe('record', () => {
      const evaluationLocator = arbitraryEvaluationLocator();
      const input: RecordEvaluationCommand = {
        groupId: arbitraryGroupId(),
        articleId: arbitraryArticleId(),
        evaluationLocator,
        publishedAt: arbitraryDate(),
        authors: [arbitraryString(), arbitraryString()],
        evaluationType: arbitraryEvaluationType(),
      };
      const result = pipe(
        initialState,
        A.last(record(input)),
      );

      it('creates the evaluation resource', () => {
        expect(result).toStrictEqual(E.right([expect.objectContaining({
          type: 'EvaluationRecorded',
          groupId: input.groupId,
          articleId: input.articleId,
          evaluationLocator: input.evaluationLocator,
          publishedAt: input.publishedAt,
          authors: input.authors,
          evaluationType: input.evaluationType,
        })]));
      });
    });

    describe('erase', () => {
      const evaluationLocator = arbitraryEvaluationLocator();
      const result = pipe(
        initialState,
        A.concat(erase({ evaluationLocator })),
      );

      it.failing('errors with not found', () => {
        expect(result).toStrictEqual(E.left('Evaluation does not exist'));
      });
    });

    describe('record removal', () => {
      const evaluationLocator = arbitraryEvaluationLocator();
      const result = pipe(
        initialState,
        A.concat(recordRemoval({ evaluationLocator })),
      );

      it.failing('errors with not found', () => {
        expect(result).toStrictEqual(E.left('Evaluation does not exist'));
      });
    });

    describe('update', () => {
      const result = pipe(
        initialState,
        A.concat(update({
          evaluationLocator: arbitraryEvaluationLocator(),
          evaluationType: 'review',
        })),
      );

      it.failing('errors with not found', () => {
        expect(result).toStrictEqual(E.left('Evaluation does not exist'));
      });
    });
  });

  describe('given a recorded evaluation', () => {
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
      A.concat(record(recordCommand)),
    );

    describe('record', () => {
      const result = pipe(
        initialState,
        A.concat(record(recordCommand)),
      );

      it('succeeds without changing state', () => {
        expect(result).toStrictEqual(initialState);
      });
    });

    describe('erase', () => {
      const newEvents = pipe(
        initialState,
        A.last(erase({ evaluationLocator: recordCommand.evaluationLocator })),
      );

      it('succeeds with a new event', () => {
        expect(newEvents).toStrictEqual(E.right([
          expect.objectContaining({
            type: 'IncorrectlyRecordedEvaluationErased',
            evaluationLocator: recordCommand.evaluationLocator,
          }),
        ]));
      });
    });

    describe('record removal', () => {
      const newEvents = pipe(
        initialState,
        A.last(recordRemoval({ evaluationLocator: recordCommand.evaluationLocator })),
      );

      it('succeeds with a new event', () => {
        expect(newEvents).toStrictEqual(E.right([
          expect.objectContaining({
            type: 'EvaluationRemovalRecorded',
            evaluationLocator: recordCommand.evaluationLocator,
          }),
        ]));
      });
    });

    describe('update', () => {
      const newEvents = pipe(
        initialState,
        A.last(update({ evaluationLocator: recordCommand.evaluationLocator, evaluationType: 'review' })),
      );

      it('succeeds with a new event', () => {
        expect(newEvents).toStrictEqual(E.right([
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
    const recordCommand = {
      groupId: arbitraryGroupId(),
      publishedAt: arbitraryDate(),
      evaluationLocator: arbitraryEvaluationLocator(),
      articleId: arbitraryArticleId(),
      authors: [],
    };

    const erasedResource = pipe(
      [],
      A.of,
      A.concat(record(recordCommand)),
      A.concat(erase({ evaluationLocator: recordCommand.evaluationLocator })),
    );

    describe('record', () => {
      it.todo('succeeds with a new event');
    });

    describe('erase', () => {
      const result = pipe(
        erasedResource,
        A.concat(erase({ evaluationLocator: recordCommand.evaluationLocator })),
      );

      it('succeeds without changing state', () => {
        expect(result).toStrictEqual(erasedResource);
      });
    });

    describe('record removal', () => {
      it.todo('errors with not found');
    });

    describe('update', () => {
      const result = pipe(
        erasedResource,
        A.concat(update({
          evaluationLocator: recordCommand.evaluationLocator,
          evaluationType: arbitraryEvaluationType(),
        })),
      );

      it('errors with not found', () => {
        expect(result).toStrictEqual(E.left('Evaluation to be updated does not exist'));
      });
    });
  });

  describe('given an evaluation that has been recorded as removed', () => {
    describe('record', () => {
      it.todo('errors with not found');
    });

    describe('erase', () => {
      it.todo('succeeds with a new event');
    });

    describe('record removal', () => {
      it.todo('succeeds without changing state');
    });

    describe('update', () => {
      it.todo('errors with not found');
    });
  });
});
