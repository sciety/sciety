import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderErrorPage = (description: HtmlFragment) => HtmlFragment;

export const renderErrorPage: RenderErrorPage = (description) => toHtmlFragment(`
  <div class="sciety-grid sciety-grid--simple">
    <h1>Oops!</h1>
    <p>
      ${description}
    </p>
    <p>
      <a href="/" class="u-call-to-action-link">Return to Homepage</a>
    </p>
  </div>
`);
