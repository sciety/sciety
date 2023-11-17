import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment.js';

export const successBanner = (message: string): HtmlFragment => toHtmlFragment(`
  <div class="success-banner">
    <div class="success-banner__heading">
      <h2>Success</h2>
    </div>
    <p>
      ${message}
    </p>
  </div>
`);
