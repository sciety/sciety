import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderErrorPage = (message: HtmlFragment) => HtmlFragment;

export const renderErrorPage: RenderErrorPage = (message) => toHtmlFragment(`
  <div class="sciety-grid sciety-grid--simple">
    <h1>Oops!</h1>
    <p>
      ${message}
    </p>
    <p>
      <a href="/" class="u-call-to-action-link">Return to Homepage</a>
    </p>
  </div>
`);
