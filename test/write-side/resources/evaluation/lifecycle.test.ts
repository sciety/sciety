import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { erase, update, record } from '../../../../src/write-side/resources/evaluation';
import { arbitraryEvaluationType } from '../../../types/evaluation-type.helper';
import { arbitraryDate } from '../../../helpers';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import * as A from '../enact';

describe('lifecycle', () => {
  describe('given an erased resource', () => {
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
      const finalState = pipe(
        erasedResource,
        A.concat(record(recordCommand)),
      );

      it('succeeds without changing state', () => {
        expect(finalState).toStrictEqual(erasedResource);
      });
    });

    describe('erase', () => {
      const finalState = pipe(
        erasedResource,
        A.concat(erase({ evaluationLocator: recordCommand.evaluationLocator })),
      );

      it('succeeds without changing state', () => {
        expect(finalState).toStrictEqual(erasedResource);
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
