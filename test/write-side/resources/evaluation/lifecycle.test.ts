import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { erase, update, record } from '../../../../src/write-side/resources/evaluation';
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

      it('succeeds without changing state', () => {
        expect(result).toStrictEqual(initialState);
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

      it('errors with not found', () => {
        expect(result).toStrictEqual(E.left('Evaluation to be updated does not exist'));
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
      it.todo('erases the evaluation resource');
    });

    describe('update', () => {
      it.todo('updates the evaluation resource');
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
      const result = pipe(
        erasedResource,
        A.concat(record(recordCommand)),
      );

      it('succeeds without changing state', () => {
        expect(result).toStrictEqual(erasedResource);
      });
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

  describe('record -> update', () => {
    const evaluationLocator = arbitraryEvaluationLocator();
    const initialEvaluationType = undefined;
    const newEvaluationType = arbitraryEvaluationType();
    const recordCommand = {
      groupId: arbitraryGroupId(),
      publishedAt: arbitraryDate(),
      evaluationLocator,
      articleId: arbitraryArticleId(),
      authors: [],
      evaluationType: initialEvaluationType,
    };

    const newEvents = pipe(
      [],
      A.of,
      A.concat(record(recordCommand)),
      A.last(update({ evaluationLocator, evaluationType: newEvaluationType })),
    );

    it('succeeds with a new event', () => {
      expect(newEvents).toStrictEqual(E.right([
        expect.objectContaining({
          type: 'EvaluationUpdated',
          evaluationLocator,
          evaluationType: newEvaluationType,
        }),
      ]));
    });
  });
});
