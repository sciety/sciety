import { HtmlFragment, toHtmlFragment } from '../types/html-fragment.js';

export const renderOopsMessage = (message: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <div class="error-page">
    <h1>Oops!</h1>
    <p>
      ${message}
    </p>   
  </div>
`);
