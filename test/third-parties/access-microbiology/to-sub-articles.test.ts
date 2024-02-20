import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { SubArticle, toSubArticles } from '../../../src/third-parties/access-microbiology/to-sub-articles';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('to-sub-articles', () => {
  describe('given an input that is not a string', () => {
    const result = toSubArticles(undefined);

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe.skip('given an input containing a single sub-article with a body containing a single paragraph', () => {
    let result: ReadonlyArray<SubArticle>;

    beforeEach(() => {
      result = pipe(
        '',
        toSubArticles,
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('returns one sub-article', () => {
      expect(result).toHaveLength(1);
    });

    it.todo('returns the subArticleId');

    it.todo('returns the body unchanged');
  });
});
