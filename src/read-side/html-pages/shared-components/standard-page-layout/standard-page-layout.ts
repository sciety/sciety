import { pipe } from 'fp-ts/function';
import { toContentWrappedInLayout } from '../../content-wrapped-in-layout';
import { mobileMenu } from '../../mobile-menu/mobile-menu';
import { PageLayout } from '../../page-layout';
import { siteFooter } from '../site-footer';
import { siteHeader } from '../site-header';

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
      ${siteFooter}
    </div>
    ${mobileMenu(user)}
  `,
  toContentWrappedInLayout,
);
