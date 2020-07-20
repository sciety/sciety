import { NotFound } from 'http-errors';
import { Result } from 'true-myth';
import createRenderArticleAbstract, { GetArticleAbstract } from '../../src/article-page/render-article-abstract';
import Doi from '../../src/types/doi';

const doi = new Doi('10.1101/815689');

describe('render-article-abstract component', (): void => {
  describe('when the article is available', () => {
    it('renders the abstract for an article', async (): Promise<void> => {
      const getArticleAbstract: GetArticleAbstract = async () => (
        Result.ok({ content: `Article ${doi.value} abstract content` })
      );

      const renderArticleAbstract = createRenderArticleAbstract(getArticleAbstract);

      const rendered = await renderArticleAbstract(doi);

      expect(rendered).toStrictEqual(expect.stringContaining(`Article ${doi.value} abstract content`));
    });
  });

  describe('when the article is unavailable', () => {
    it('throws an error', async (): Promise<void> => {
      const getArticleAbstract: GetArticleAbstract = async () => (
        Result.err('not-found')
      );

      const renderArticleAbstract = createRenderArticleAbstract(getArticleAbstract);

      await expect(renderArticleAbstract(doi)).rejects.toThrow(NotFound);
    });
  });
});
