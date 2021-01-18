import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { constant, pipe } from 'fp-ts/lib/function';
import { JSDOM } from 'jsdom';
import createRenderPageHeader, {
  GetArticleDetails,
  RenderPageHeader,
} from '../../src/article-page/render-page-header';
import Doi from '../../src/types/doi';
import { HtmlFragment, toHtmlFragment } from '../../src/types/html-fragment';
import { SanitisedHtmlFragment } from '../../src/types/sanitised-html-fragment';

const getArticleDetails: GetArticleDetails<never> = (doi) => TE.right({
  title: `Lorem ipsum ${doi.value}` as SanitisedHtmlFragment,
  authors: ['Gary', 'Uncle Wiggly'],
});

describe('render-page-header component', (): void => {
  let renderPageHeader: RenderPageHeader<never>;
  let rendered: E.Either<unknown, HtmlFragment>;

  beforeEach(async () => {
    renderPageHeader = createRenderPageHeader(getArticleDetails, () => pipe('', toHtmlFragment, T.of));
    rendered = (await renderPageHeader(new Doi('10.1101/815689'), O.none)());
  });

  it('renders inside an header tag', () => {
    expect(rendered).toStrictEqual(E.right(expect.stringMatching(/^\s*<header\s|>/)));
  });

  it('renders the title for an article', async (): Promise<void> => {
    expect(rendered).toStrictEqual(E.right(expect.stringContaining('Lorem ipsum 10.1101/815689')));
  });

  it('renders the article DOI according to CrossRef display guidelines', () => {
    const html = pipe(rendered, E.getOrElse(constant('')));
    const links = JSDOM.fragment(html).querySelectorAll('a');

    expect(links[0].textContent).toStrictEqual('https://doi.org/10.1101/815689');
  });

  it('renders the article authors', () => {
    expect(rendered).toStrictEqual(E.right(expect.stringContaining('Gary')));
    expect(rendered).toStrictEqual(E.right(expect.stringContaining('Uncle Wiggly')));
  });
});
