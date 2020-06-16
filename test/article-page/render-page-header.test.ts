import createRenderPageHeader, { GetArticleDetails, RenderPageHeader } from '../../src/article-page/render-page-header';
import Doi from '../../src/data/doi';

describe('render-page-header component', (): void => {
  let renderPageHeader: RenderPageHeader;
  let rendered: string;

  beforeEach(async () => {
    const getArticleDetails: GetArticleDetails = async (doi) => ({
      title: `Lorem ipsum ${doi}`,
      authors: ['Gary', 'Uncle Wiggly'],
      publicationDate: new Date('2020-06-03'),
    });

    renderPageHeader = createRenderPageHeader(getArticleDetails);

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

  describe('the article has been endorsed', (): void => {
    it('displays the endorsing editorial communities', async (): Promise<void> => {
      rendered = await renderPageHeader(new Doi('10.1101/209320'));

      expect(rendered).toStrictEqual(expect.stringMatching(/Endorsed by[\s\S]*?PeerJ/));
    });
  });

  describe('the article has not been endorsed', (): void => {
    it('does not display endorsement details', async (): Promise<void> => {
      expect(rendered).toStrictEqual(expect.not.stringContaining('Endorsed by'));
    });
  });
});
