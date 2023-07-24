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
  describe('record -> erase -> update', () => {
    const recordCommand = {
      groupId: arbitraryGroupId(),
      publishedAt: arbitraryDate(),
      evaluationLocator: arbitraryEvaluationLocator(),
      articleId: arbitraryArticleId(),
      authors: [],
    };

    const result = pipe(
      [],
      A.of,
      A.chain(record(recordCommand)),
      A.chain(erase({ evaluationLocator: recordCommand.evaluationLocator })),
      A.chain(update({
        evaluationLocator: recordCommand.evaluationLocator,
        evaluationType: arbitraryEvaluationType(),
      })),
    );

    it('errors with not found', () => {
      expect(result).toStrictEqual(E.left('Evaluation to be updated does not exist'));
    });
  });

  describe('record -> erase -> erase', () => {
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
      A.chain(record(recordCommand)),
      A.chain(erase({ evaluationLocator: recordCommand.evaluationLocator })),
    );

    const finalState = pipe(
      initialState,
      A.chain(erase({ evaluationLocator: recordCommand.evaluationLocator })),
    );

    it('succeeds without changing state', () => {
      expect(finalState).toStrictEqual(initialState);
    });
  });

  describe('record -> update', () => {
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
      A.chain(record(recordCommand)),
    );

    const finalState = pipe(
      initialState,
      A.chain(update({ ...recordCommand, evaluationType: 'review' })),
    );

    it('succeeds with a new event', () => {
      expect(finalState).toStrictEqual(E.right([
        expect.anything(),
        expect.objectContaining({ evaluationType: 'review' }),
      ]));
    });
  });
});
