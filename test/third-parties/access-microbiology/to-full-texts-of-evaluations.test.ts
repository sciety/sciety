import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { toFullTextsOfEvaluations } from '../../../src/third-parties/access-microbiology/to-full-texts-of-evaluations';
import { abortTest } from '../../framework/abort-test';
import { arbitraryWord } from '../../helpers';
import { SanitisedHtmlFragment } from '../../../src/types/sanitised-html-fragment';

describe('to-full-texts-of-evaluations', () => {
  describe('given an input that is not a string', () => {
    const result = toFullTextsOfEvaluations(undefined);

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('given a string input that cannot be parsed', () => {
    let result: ReturnType<typeof toFullTextsOfEvaluations>;

    beforeEach(() => {
      result = toFullTextsOfEvaluations('<><');
    });

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('given an input containing a single sub-article without a body', () => {
    let result: ReadonlyMap<string, SanitisedHtmlFragment>;

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
        toFullTextsOfEvaluations,
        E.getOrElseW(abortTest('returned on the left')),
      );
    });

    it('returns an empty map', () => {
      expect(result.size).toBe(0);
    });
  });

  describe('given an input containing a single sub-article with a body containing a single paragraph', () => {
    const subArticleId = arbitraryWord();
    let result: ReadonlyMap<string, SanitisedHtmlFragment>;

    beforeEach(() => {
      result = pipe(
        `
          <article>
            <sub-article>
              <front-stub>
                <article-id>${subArticleId}</article-id>
              </front-stub>
              <body>
                <p></p>
              </body>
            </sub-article>
          </article>
        `,
        toFullTextsOfEvaluations,
        E.getOrElseW(abortTest('returned on the left')),
      );
    });

    it('returns a map with one element', () => {
      expect(result.size).toBe(1);
    });

    it.failing('returns the body addressable by the <article-id> of its <sub-article>', () => {
      expect(result.has(subArticleId)).toBe(true);
    });

    it.todo('returns the body unchanged');
  });
});
