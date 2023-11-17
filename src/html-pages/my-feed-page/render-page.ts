import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../types/html-fragment.js';
import { HtmlPage } from '../html-page.js';

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

export const renderPage = (components: Components): HtmlPage => ({
  title: 'My Feed',
  content: pipe(components, render, toHtmlFragment),
});
