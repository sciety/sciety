import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

// TODO: should all be HtmlFragment
type Components = {
  header: string,
  feed: string,
  editorialCommunities: string,
};

const render = (components: Components) => `
  <div class="sciety-grid sciety-grid--home">
    ${components.header}
    <div class="home-page-feed-container">
      ${components.feed}
    </div>
    <div class="home-page-side-bar">
      ${components.editorialCommunities}
    </div>
  </div>
`;

export const renderPage = (components: Components): Page => ({
  title: 'Sciety: where research is evaluated and curated by the communities you trust',
  content: pipe(components, render, toHtmlFragment),
});
