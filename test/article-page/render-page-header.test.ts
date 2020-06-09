import createRenderPageHeader, { GetArticleDetails } from '../../src/article-page/render-page-header';
import Doi from '../../src/data/doi';

describe('render-page-header component', (): void => {
  let rendered: string;

  beforeEach(async () => {
    const getArticleDetails: GetArticleDetails = async (doi) => ({
      title: `Lorem ipsum ${doi}`,
      authors: ['Gary', 'Uncle Wiggly'],
      publicationDate: new Date('2020-06-03'),
    });

    const renderPageHeader = createRenderPageHeader(getArticleDetails);

    rendered = await renderPageHeader(new Doi('10.1101/815689'));
  });

  it('renders inside an header tag', () => {
    expect(rendered).toStrictEqual(expect.stringMatching(/^\s*<header\s|>/));
  });

  it('renders the title for an article', async (): Promise<void> => {
    expect(rendered).toStrictEqual(expect.stringContaining('Lorem ipsum 10.1101/815689'));
  });

  it('renders the article DOI', () => {
    expect(rendered).toStrictEqual(expect.stringContaining('10.1101/815689'));
  });

  it('renders the article publication date', () => {
    expect(rendered).toStrictEqual(expect.stringContaining('2020-06-03'));
  });

  it('renders the article authors', () => {
    expect(rendered).toStrictEqual(expect.stringContaining('Gary'));
    expect(rendered).toStrictEqual(expect.stringContaining('Uncle Wiggly'));
  });
});
