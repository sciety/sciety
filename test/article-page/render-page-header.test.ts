import createRenderPageHeader, { GetArticleDetails } from '../../src/article-page/render-page-header';
import Doi from '../../src/data/doi';

describe('render-page-header component', (): void => {
  it('renders the page header for an article', async (): Promise<void> => {
    const getArticleDetails: GetArticleDetails = async (doi) => ({
      title: `Lorem ipsum ${doi}`,
      authors: [],
      publicationDate: new Date('2020-06-03'),
    });

    const renderPageHeader = createRenderPageHeader(getArticleDetails);

    const rendered = await renderPageHeader(new Doi('10.1101/815689'));

    expect(rendered).toStrictEqual(expect.stringContaining('Lorem ipsum 10.1101/815689'));
  });
});
