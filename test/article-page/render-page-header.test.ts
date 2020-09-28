import { Result } from 'true-myth';
import createRenderPageHeader, {
  GetArticleDetails,
  RenderPageHeader,
} from '../../src/article-page/render-page-header';
import Doi from '../../src/types/doi';

const getArticleDetails: GetArticleDetails = async (doi) => (Result.ok({
  title: `Lorem ipsum ${doi.value}`,
  authors: ['Gary', 'Uncle Wiggly'],
  publicationDate: new Date('2020-06-03'),
}));

describe('render-page-header component', (): void => {
  let renderPageHeader: RenderPageHeader;
  let rendered: Result<string, 'not-found'|'unavailable'>;

  beforeEach(async () => {
    renderPageHeader = createRenderPageHeader(getArticleDetails);
    rendered = await renderPageHeader(new Doi('10.1101/815689'));
  });

  it('renders inside an header tag', () => {
    expect(rendered.unsafelyUnwrap()).toStrictEqual(expect.stringMatching(/^\s*<header\s|>/));
  });

  it('renders the title for an article', async (): Promise<void> => {
    expect(rendered.unsafelyUnwrap()).toStrictEqual(expect.stringContaining('Lorem ipsum 10.1101/815689'));
  });

  it('renders the article DOI', () => {
    expect(rendered.unsafelyUnwrap()).toStrictEqual(expect.stringContaining('10.1101/815689'));
  });

  it('renders the article publication date', () => {
    expect(rendered.unsafelyUnwrap()).toStrictEqual(expect.stringContaining('2020-06-03'));
  });

  it('renders the article authors', () => {
    expect(rendered.unsafelyUnwrap()).toStrictEqual(expect.stringContaining('Gary'));
    expect(rendered.unsafelyUnwrap()).toStrictEqual(expect.stringContaining('Uncle Wiggly'));
  });
});
