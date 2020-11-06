import { Result } from 'true-myth';
import createRenderArticleAbstract, { GetArticleAbstract } from '../../src/article-page/render-article-abstract';
import Doi from '../../src/types/doi';

const doi = new Doi('10.1101/815689');

describe('render-article-abstract component', (): void => {
  describe('when the article is available', () => {
    it('renders the abstract for an article', async (): Promise<void> => {
      const getArticleAbstract: GetArticleAbstract<never> = async () => (
        Result.ok(`Article ${doi.value} abstract content`)
      );

      const renderArticleAbstract = createRenderArticleAbstract(getArticleAbstract);

      const rendered = (await renderArticleAbstract(doi)).unsafelyUnwrap();

      expect(rendered).toStrictEqual(expect.stringContaining(`Article ${doi.value} abstract content`));
    });
  });

  describe('when the article is unavailable', () => {
    it('passes the error through unchanged', async (): Promise<void> => {
      const getArticleAbstract: GetArticleAbstract<'any-error'> = async () => (
        Result.err('any-error')
      );

      const renderArticleAbstract = createRenderArticleAbstract(getArticleAbstract);
      const error = (await renderArticleAbstract(doi)).unsafelyUnwrapErr();

      expect(error).toStrictEqual('any-error');
    });
  });
});
