import { flow } from 'fp-ts/lib/function';
import { Remarkable } from 'remarkable';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderPage = (markdown: string) => HtmlFragment;

const addPageWrapper = (html: string): string => `
  <div class="about-page-wrapper">
    <header class="page-header">
      <h1>
        About Sciety
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
