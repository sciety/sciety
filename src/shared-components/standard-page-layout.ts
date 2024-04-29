import { pipe } from 'fp-ts/function';
import { toContentWrappedInLayout } from '../read-side/html-pages/content-wrapped-in-layout';
import { PageLayout } from '../read-side/html-pages/page-layout';
import { siteFooter } from '../read-side/html-pages/shared-components/site-footer';
import { siteHeader } from '../read-side/html-pages/shared-components/site-header';

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
