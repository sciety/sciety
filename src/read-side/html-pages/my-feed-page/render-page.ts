import { pipe } from 'fp-ts/function';
import { HtmlPage, toHtmlPage } from '../../../html-pages/html-page';
import { toHtmlFragment } from '../../../types/html-fragment';

// TODO: should all be HtmlFragment
type Components = {
  header: string,
  content: string,
};

const render = (components: Components) => `
  ${components.header}
  <div>
    ${components.content}
  </div>
`;

export const renderPage = (components: Components): HtmlPage => toHtmlPage({
  title: 'My Feed',
  content: pipe(components, render, toHtmlFragment),
});
