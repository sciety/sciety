import createRenderArticleAbstract, { GetArticleAbstract } from '../../src/article-page/render-article-abstract';
import Doi from '../../src/types/doi';

describe('render-article-abstract component', (): void => {
  it('renders the abstract for an article', async (): Promise<void> => {
    const getArticleAbstract: GetArticleAbstract = async (doi) => ({ content: `Article ${doi} abstract content` });

    const renderArticleAbstract = createRenderArticleAbstract(getArticleAbstract);

    const rendered = await renderArticleAbstract(new Doi('10.1101/815689'));

    expect(rendered).toStrictEqual(expect.stringContaining('Article 10.1101/815689 abstract content'));
  });
});
