import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

// TODO: should all be HtmlFragment
type Components = {
  header: string,
  feed: string,
};

const render = (components: Components) => `
  <div class="page-content__background">
    <div class="sciety-grid sciety-grid--logged-in-home-page">
      ${components.header}
      <div class="logged-in-home-page-feed-container">
        ${components.feed}
      </div>
    </div>
  </div>
`;

export const renderPage = (components: Components): Page => ({
  title: 'Sciety: where research is evaluated and curated by the communities you trust',
  content: pipe(components, render, toHtmlFragment),
});
