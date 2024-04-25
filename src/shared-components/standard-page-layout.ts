import { pipe } from 'fp-ts/function';
import { siteHeader } from './site-header';
import { toContentWrappedInLayout } from '../html-pages/content-wrapped-in-layout';
import { PageLayout } from '../html-pages/page-layout';
import { siteFooter } from '../read-side/html-pages/shared-components/site-footer';

export const standardPageLayout: PageLayout = (user) => (page) => pipe(
  `
    <div class="standard-page-container">
      ${siteHeader(user)}

      <main id="mainContent">
        <div class="page-content">
          <div class="sciety-grid-two-columns">
            ${page.content}
          </div>
        </div>
      </main>
      ${siteFooter(user)}
    </div>
  `,
  toContentWrappedInLayout,
);
