import { flow } from 'fp-ts/function';
import { Remarkable } from 'remarkable';
import { toHtmlFragment } from '../types/html-fragment';

const addPageWrapper = (html: string) => `
  <div class="about-page-wrapper">
    <header class="page-header-static">
      <h1>
        About Sciety
      </h1>
    </header>
    ${html}
  </div>
`;

const convertMarkdownToHtml = (md: string) => new Remarkable({ html: true }).render(md);

export const renderPage = flow(
  convertMarkdownToHtml,
  addPageWrapper,
  toHtmlFragment,
);
