import * as T from 'fp-ts/lib/Task';
import { JSDOM } from 'jsdom';
import { Result } from 'true-myth';
import createRenderPageHeader, {
  GetArticleDetails,
  RenderPageHeader,
} from '../../src/article-page/render-page-header';
import Doi from '../../src/types/doi';
import { HtmlFragment } from '../../src/types/html-fragment';
import { SanitisedHtmlFragment } from '../../src/types/sanitised-html-fragment';

const getArticleDetails: GetArticleDetails<never> = (doi) => T.of(Result.ok({
  title: `Lorem ipsum ${doi.value}` as SanitisedHtmlFragment,
  authors: ['Gary', 'Uncle Wiggly'],
}));

describe('render-page-header component', (): void => {
  let renderPageHeader: RenderPageHeader<never>;
  let rendered: HtmlFragment;

  beforeEach(async () => {
    renderPageHeader = createRenderPageHeader(getArticleDetails);
    rendered = (await renderPageHeader(new Doi('10.1101/815689'))).unsafelyUnwrap();
  });

  it('renders inside an header tag', () => {
    expect(rendered).toStrictEqual(expect.stringMatching(/^\s*<header\s|>/));
  });

  it('renders the title for an article', async (): Promise<void> => {
    expect(rendered).toStrictEqual(expect.stringContaining('Lorem ipsum 10.1101/815689'));
  });

  it('renders the article DOI according to CrossRef display guidelines', () => {
    const links = JSDOM.fragment(rendered).querySelectorAll('a');

    expect(links).toHaveLength(1);
    expect(links[0].textContent).toStrictEqual('https://doi.org/10.1101/815689');
  });

  it('renders the article authors', () => {
    expect(rendered).toStrictEqual(expect.stringContaining('Gary'));
    expect(rendered).toStrictEqual(expect.stringContaining('Uncle Wiggly'));
  });
});
