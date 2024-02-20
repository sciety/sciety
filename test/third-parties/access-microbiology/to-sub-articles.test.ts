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
          <?xml version="1.0" encoding="UTF-8"?>
          <!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Archiving and Interchange DTD v1.1 20151215//EN" "JATS-archivearticle1.dtd">
          <article dtd-version="1.1" article-type="case-report" xml:lang="EN" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:mml="http://www.w3.org/1998/Math/MathML" specific-use="pre-print">
            <sub-article article-type="review-tool-report" id="report.acmi.0.000569.v1.1">
              <front-stub>
                <article-id pub-id-type="doi">10.1099/acmi.0.000569.v1.1</article-id>
              </front-stub>
            </sub-article>
          </article>
        `,
        toSubArticles,
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it.failing('returns an empty array', () => {
      expect(result).toHaveLength(0);
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
