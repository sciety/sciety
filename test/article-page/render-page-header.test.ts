import { JSDOM } from 'jsdom';
import createRenderPageHeader, {
  GetArticleDetails,
  GetCommentCountErrorFromArticlePage,
  RenderPageHeader,
} from '../../src/article-page/render-page-header';
import Doi from '../../src/types/doi';

const getArticleDetails: GetArticleDetails = async (doi) => ({
  title: `Lorem ipsum ${doi}`,
  authors: ['Gary', 'Uncle Wiggly'],
  publicationDate: new Date('2020-06-03'),
});

describe('render-page-header component', (): void => {
  let renderPageHeader: RenderPageHeader;
  let rendered: string;

  beforeEach(async () => {
    renderPageHeader = createRenderPageHeader(getArticleDetails, async () => 0, async () => 0, async () => [], '#reviews');
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

  describe('the article has reviews', (): void => {
    it('displays the number of reviews', async (): Promise<void> => {
      renderPageHeader = createRenderPageHeader(getArticleDetails, async () => 2, async () => 0, async () => [], '#reviews');
      rendered = await renderPageHeader(new Doi('10.1101/209320'));

      expect(rendered).toStrictEqual(expect.stringMatching(/Reviews[\s\S]*?2/));
    });

    it('links to the reviews heading on the same page', async (): Promise<void> => {
      renderPageHeader = createRenderPageHeader(getArticleDetails, async () => 2, async () => 0, async () => [], '/path/to/the/reviews');
      const pageHeader = JSDOM.fragment(await renderPageHeader(new Doi('10.1101/209320')));

      const anchor = pageHeader.querySelector('a[data-test-id="reviewsLink"]');

      expect(anchor).not.toBeNull();
      expect(anchor?.getAttribute('href')).toStrictEqual('/path/to/the/reviews');
    });
  });

  describe('the article does not have reviews', (): void => {
    it('does not display review details', async (): Promise<void> => {
      expect(rendered).toStrictEqual(expect.not.stringContaining('Reviews'));
    });
  });

  describe('the article has comments', (): void => {
    it('displays the number of comments', async (): Promise<void> => {
      renderPageHeader = createRenderPageHeader(getArticleDetails, async () => 0, async () => 11, async () => [], '#reviews');
      rendered = await renderPageHeader(new Doi('10.1101/815689'));

      expect(rendered).toStrictEqual(expect.stringMatching(/Comments[\s\S]*?11/));
    });

    it('links to v1 of the article on Biorxiv', async (): Promise<void> => {
      renderPageHeader = createRenderPageHeader(getArticleDetails, async () => 0, async () => 11, async () => [], '#reviews');
      const pageHeader = JSDOM.fragment(await renderPageHeader(new Doi('10.1101/815689')));

      const anchor = pageHeader.querySelector<HTMLAnchorElement>('a[data-test-id="biorxivCommentLink"]');

      expect(anchor).not.toBeNull();
      expect(anchor?.href).toStrictEqual('https://www.biorxiv.org/content/10.1101/815689v1');
    });
  });

  describe('the article does not have comments', (): void => {
    it('does not display comment details', async (): Promise<void> => {
      expect(rendered).toStrictEqual(expect.not.stringContaining('Comments'));
    });
  });

  describe('the article\'s comments are not available', (): void => {
    it('does not display comment details', async (): Promise<void> => {
      renderPageHeader = createRenderPageHeader(
        getArticleDetails,
        async () => 0,
        async () => {
          throw new GetCommentCountErrorFromArticlePage();
        },
        async () => [],
        '#reviews',
      );
      rendered = await renderPageHeader(new Doi('10.1101/815689'));

      expect(rendered).toStrictEqual(expect.not.stringContaining('Comments'));
    });
  });

  describe('the article has been endorsed', (): void => {
    it('displays the endorsing editorial communities', async (): Promise<void> => {
      renderPageHeader = createRenderPageHeader(getArticleDetails, async () => 0, async () => 0, async () => ['PeerJ'], '#reviews');
      rendered = await renderPageHeader(new Doi('10.1101/815689'));

      expect(rendered).toStrictEqual(expect.stringMatching(/Endorsed by[\s\S]*?PeerJ/));
    });
  });

  describe('the article has not been endorsed', (): void => {
    it('does not display endorsement details', async (): Promise<void> => {
      expect(rendered).toStrictEqual(expect.not.stringContaining('Endorsed by'));
    });
  });
});
