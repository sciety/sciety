import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

// TODO: should all be HtmlFragment
type Components = {
  header: string,
  feed: string,
};

const render = (components: Components) => `
  ${components.header}
  <div class="logged-in-home-page-feed-container">
    ${components.feed}
  </div>
`;

export const renderPage = (components: Components): Page => ({
  title: 'My Feed',
  content: pipe(components, render, toHtmlFragment),
});
