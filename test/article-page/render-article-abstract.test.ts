import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { createRenderArticleAbstract, GetArticleAbstract } from '../../src/article-page/render-article-abstract';
import { Doi } from '../../src/types/doi';
import { SanitisedHtmlFragment } from '../../src/types/sanitised-html-fragment';

const doi = new Doi('10.1101/815689');

describe('render-article-abstract component', (): void => {
  describe('when the article is available', () => {
    it('renders the abstract for an article', async (): Promise<void> => {
      const getArticleAbstract: GetArticleAbstract<never> = () => TE.right(
        `Article ${doi.value} abstract content` as SanitisedHtmlFragment,
      );

      const renderArticleAbstract = createRenderArticleAbstract(getArticleAbstract);

      const rendered = await renderArticleAbstract(doi)();

      expect(rendered).toStrictEqual(E.right(expect.stringContaining(`Article ${doi.value} abstract content`)));
    });
  });

  describe('when the article is unavailable', () => {
    it('passes the error through unchanged', async (): Promise<void> => {
      const getArticleAbstract: GetArticleAbstract<'any-error'> = () => TE.left('any-error');

      const renderArticleAbstract = createRenderArticleAbstract(getArticleAbstract);
      const error = await renderArticleAbstract(doi)();

      expect(error).toStrictEqual(E.left('any-error'));
    });
  });
});
