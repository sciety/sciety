import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

export const successBanner = (message: string): HtmlFragment => toHtmlFragment(`
  <div class="success-banner" role="region" aria-labelledby="success-notification-banner-title" >
    <div class="success-banner__heading">
      <h2 id="success-notification-banner-title">Success</h2>
    </div>
    <p>
      ${message}
    </p>
  </div>
`);
