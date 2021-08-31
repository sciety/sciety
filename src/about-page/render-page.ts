import { flow } from 'fp-ts/function';
import { Remarkable } from 'remarkable';
import { toHtmlFragment } from '../types/html-fragment';

const addPageWrapper = (html: string) => `
  <div class="sciety-grid sciety-grid--one-column">
    <header class="page-header">
      <h1>
        About Sciety
      </h1>
    </header>
    <div class="about-page-content">
      ${html}
    </div>
  </div>
`;

const convertMarkdownToHtml = (md: string) => new Remarkable({ html: true }).render(md);

export const renderPage = flow(
  convertMarkdownToHtml,
  addPageWrapper,
  toHtmlFragment,
);
