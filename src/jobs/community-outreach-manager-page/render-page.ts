import { flow } from 'fp-ts/function';
import { Remarkable } from 'remarkable';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type RenderPage = (markdown: string) => HtmlFragment;

const addPageWrapper = (html: string): string => `
  <div class="about-page-wrapper">
    <header class="page-header">
      <h1>
        Community and Outreach Manager
      </h1>
    </header>
    ${html}
  </div>
`;

const convertMarkdownToHtml = (md: string): string => new Remarkable({ html: true }).render(md);

export const renderPage: RenderPage = flow(
  convertMarkdownToHtml,
  addPageWrapper,
  toHtmlFragment,
);
