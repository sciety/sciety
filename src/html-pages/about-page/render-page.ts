import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { content } from './content';

const addPageWrapper = (html: string) => `
  <header class="page-header">
    <h1>
      About Sciety
    </h1>
  </header>
  <div>
    ${html}
  </div>  
`;

export const renderPage = (): HtmlFragment => pipe(
  content,
  addPageWrapper,
  toHtmlFragment,
);
