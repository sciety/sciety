import * as E from 'fp-ts/Either';
import { recordEvaluationCommandCodec } from '../../src/commands';
import { validateInputShape } from '../../src/commands/validate-input-shape';
import * as RI from '../../src/types/review-id';
import { arbitraryDate, arbitraryString } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('validate-input-shape', () => {
  const groupId = arbitraryGroupId();
  const publishedAt = arbitraryDate();
  const evaluationLocator = arbitraryReviewId();
  const articleId = arbitraryArticleId();
  const authors = [arbitraryString(), arbitraryString()];

  describe('when the input is valid', () => {
    it('returns a Command', () => {
      const result = validateInputShape(recordEvaluationCommandCodec)({
        groupId: groupId.toString(),
        publishedAt: publishedAt.toISOString(),
        evaluationLocator: RI.serialize(evaluationLocator),
        articleId: articleId.value,
        authors,
      });

      expect(result).toStrictEqual(E.right({
        groupId,
        publishedAt,
        evaluationLocator,
        articleId,
        authors,
      }));
    });
  });

  describe('when the input is invalid', () => {
    describe('because the groupId is invalid', () => {
      it('returns an error message', () => {
        const result = validateInputShape(recordEvaluationCommandCodec)({
          groupId: null,
          publishedAt: publishedAt.toISOString(),
          evaluationLocator: RI.serialize(evaluationLocator),
          articleId: articleId.value,
          authors,
        });

        expect(result).toStrictEqual(E.left(expect.stringMatching(/.+/)));
      });
    });

    describe('because the publishedAt is invalid', () => {
      it('returns an error message', () => {
        const result = validateInputShape(recordEvaluationCommandCodec)({
          groupId: groupId.toString(),
          publishedAt: null,
          evaluationLocator: RI.serialize(evaluationLocator),
          articleId: articleId.value,
          authors,
        });

        expect(result).toStrictEqual(E.left(expect.stringMatching(/.+/)));
      });
    });

    describe('because the evaluationLocator is invalid', () => {
      it('returns an error message', () => {
        const result = validateInputShape(recordEvaluationCommandCodec)({
          groupId: groupId.toString(),
          publishedAt: publishedAt.toISOString(),
          evaluationLocator: null,
          articleId: articleId.value,
          authors,
        });

        expect(result).toStrictEqual(E.left(expect.stringMatching(/.+/)));
      });
    });

    describe('because the articleId is invalid', () => {
      it('returns an error message', () => {
        const result = validateInputShape(recordEvaluationCommandCodec)({
          groupId: groupId.toString(),
          publishedAt: publishedAt.toISOString(),
          evaluationLocator: RI.serialize(evaluationLocator),
          articleId: null,
          authors,
        });

        expect(result).toStrictEqual(E.left(expect.stringMatching(/.+/)));
      });
    });

    describe('because the authors is invalid', () => {
      it('returns an error message', () => {
        const result = validateInputShape(recordEvaluationCommandCodec)({
          groupId: groupId.toString(),
          publishedAt: publishedAt.toISOString(),
          evaluationLocator: RI.serialize(evaluationLocator),
          articleId: articleId.value,
          authors: null,
        });

        expect(result).toStrictEqual(E.left(expect.stringMatching(/.+/)));
      });
    });
  });
});
