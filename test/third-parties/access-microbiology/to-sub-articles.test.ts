import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { SubArticle, toSubArticles } from '../../../src/third-parties/access-microbiology/to-sub-articles';
import { abortTest } from '../../framework/abort-test';

describe('to-sub-articles', () => {
  describe('given an input that is not a string', () => {
    const result = toSubArticles(undefined);

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('given a string input that cannot be parsed', () => {
    let result: ReturnType<typeof toSubArticles>;

    beforeEach(() => {
      result = toSubArticles('<><');
    });

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('given an input containing a single sub-article without a body', () => {
    let result: ReadonlyArray<SubArticle>;

    beforeEach(() => {
      result = pipe(
        `
          <article>
            <sub-article>
              <front-stub>
                <article-id>10.1099/acmi.0.000569.v1.1</article-id>
              </front-stub>
            </sub-article>
          </article>
        `,
        toSubArticles,
        E.getOrElseW(abortTest('returned on the left')),
      );
    });

    it.failing('returns an empty array', () => {
      expect(result).toHaveLength(0);
    });
  });

  describe('given an input containing a single sub-article with a body containing a single paragraph', () => {
    let result: ReadonlyArray<SubArticle>;

    beforeEach(() => {
      result = pipe(
        `
          <article>
            <sub-article>
              <front-stub>
                <article-id>10.1099/acmi.0.000569.v1.1</article-id>
              </front-stub>
              <body>
                <p></p>
              </body>
            </sub-article>
          </article>
        `,
        toSubArticles,
        E.getOrElseW(abortTest('returned on the left')),
      );
    });

    it('returns one sub-article', () => {
      expect(result).toHaveLength(1);
    });

    it.todo('returns the subArticleId');

    it.todo('returns the body unchanged');
  });
});
