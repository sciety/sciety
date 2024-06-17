import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export const renderOopsMessage = (message: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <header class="page-header">
    <h1>Oops!</h1>
  </header>
  <p>
    ${message}
  </p>
`);
