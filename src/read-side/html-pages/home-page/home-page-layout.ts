import { pipe } from 'fp-ts/function';
import { toContentWrappedInLayout } from '../content-wrapped-in-layout';
import { mobileMenu } from '../mobile-menu/mobile-menu';
import { PageLayout } from '../page-layout';
import { siteFooter } from '../shared-components/site-footer';
import { siteHeader } from '../shared-components/site-header';

export const homePageLayout: PageLayout = (user) => (page) => pipe(
  `
  <div class="home-page-container">
    ${siteHeader(user, 'dark')}

    <main id="mainContent">
      ${page.content}
    </main>

    ${siteFooter}
  </div>
  ${mobileMenu(user)}
`,
  toContentWrappedInLayout,
);
