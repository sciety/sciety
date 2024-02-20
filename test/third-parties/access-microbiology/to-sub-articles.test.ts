import * as E from 'fp-ts/Either';
import { toSubArticles } from '../../../src/third-parties/access-microbiology/to-sub-articles';

describe('to-sub-articles', () => {
  describe('given an input that is not a string', () => {
    const result = toSubArticles(undefined);

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('given an input containing a single sub-article with a body containing a single paragraph', () => {
    it.todo('returns one sub-article');

    it.todo('returns the subArticleId');

    it.todo('returns the body unchanged');
  });
});
