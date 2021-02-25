import { flow } from 'fp-ts/function';
import { Remarkable } from 'remarkable';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';

const addPageWrapper = (html: string) => `
  <div class="about-page-wrapper">
    <header class="page-header">
      <h1>
        About Sciety
      </h1>
    </header>
    ${html}
  </div>
`;

const convertMarkdownToHtml = (md: string) => new Remarkable({ html: true }).render(md);

const toPage = (html: HtmlFragment) => ({
  title: 'About',
  content: html,
});

export const renderPage = flow(
  convertMarkdownToHtml,
  addPageWrapper,
  toHtmlFragment,
  toPage,
);

export const renderErrorPage = (e: 'not-found' | 'unavailable'): RenderPageError => {
  if (e === 'not-found') {
    return {
      type: 'not-found',
      message: toHtmlFragment('We couldn\'t find this information; please try again later.'),
    };
  }
  return {
    type: 'unavailable',
    message: toHtmlFragment('We couldn\'t find this information; please try again later.'),
  };
};
