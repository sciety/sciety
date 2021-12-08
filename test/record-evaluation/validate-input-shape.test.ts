import * as E from 'fp-ts/Either';
import { validateInputShape } from '../../src/record-evaluation/validate-input-shape';
import * as RI from '../../src/types/review-id';
import { arbitraryDate } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('validate-input-shape', () => {
  const groupId = arbitraryGroupId();
  const publishedAt = arbitraryDate();
  const evaluationLocator = arbitraryReviewId();
  const articleId = arbitraryDoi();

  describe('when the input is valid', () => {
    it('returns a Command', () => {
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
      it('returns an error message', () => {
        const result = validateInputShape({
          groupId: null,
          publishedAt: publishedAt.toISOString(),
          evaluationLocator: RI.serialize(evaluationLocator),
          articleId: articleId.value,
        });

        expect(result).toStrictEqual(E.left(expect.stringMatching(/.+/)));
      });
    });

    describe('because the publishedAt is invalid', () => {
      it('returns an error message', () => {
        const result = validateInputShape({
          groupId: groupId.toString(),
          publishedAt: null,
          evaluationLocator: RI.serialize(evaluationLocator),
          articleId: articleId.value,
        });

        expect(result).toStrictEqual(E.left(expect.stringMatching(/.+/)));
      });
    });

    describe('because the evaluationLocator is invalid', () => {
      it('returns an error message', () => {
        const result = validateInputShape({
          groupId: groupId.toString(),
          publishedAt: publishedAt.toISOString(),
          evaluationLocator: null,
          articleId: articleId.value,
        });

        expect(result).toStrictEqual(E.left(expect.stringMatching(/.+/)));
      });
    });

    describe('because the articleId is invalid', () => {
      it('returns an error message', () => {
        const result = validateInputShape({
          groupId: groupId.toString(),
          publishedAt: publishedAt.toISOString(),
          evaluationLocator: RI.serialize(evaluationLocator),
          articleId: null,
        });

        expect(result).toStrictEqual(E.left(expect.stringMatching(/.+/)));
      });
    });
  });
});
