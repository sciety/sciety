import * as E from 'fp-ts/Either';
import { validateInputShape } from '../../src/record-evaluation/validate-input-shape';
import * as RI from '../../src/types/review-id';
import { arbitraryDate } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('validate-input-shape', () => {
  describe('when the input is valid', () => {
    it.skip('returns a Command', () => {
      const groupId = arbitraryGroupId();
      const publishedAt = arbitraryDate();
      const evaluationLocator = arbitraryReviewId();
      const articleId = arbitraryDoi();

      const result = validateInputShape({
        groupId: groupId.toString(),
        publishedAt: publishedAt.toISOString(),
        evaluationLocator: RI.serialize(evaluationLocator),
        articleId: articleId.value,
      });

      expect(result).toStrictEqual(E.right({
        groupId,
        publishedAt,
        evaluationLocator,
        articleId,
      }));
    });
  });

  describe('when the input is invalid', () => {
    describe('because the groupId is invalid', () => {
      it.todo('returns an error message');
    });

    describe('because the publishedAt is invalid', () => {
      it.todo('returns an error message');
    });

    describe('because the evaluationLocator is invalid', () => {
      it.todo('returns an error message');
    });

    describe('because the articleId is invalid', () => {
      it.todo('returns an error message');
    });
  });
});
