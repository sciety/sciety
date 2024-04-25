import { pipe } from 'fp-ts/function';
import { toContentWrappedInLayout } from '../../../html-pages/content-wrapped-in-layout';
import { PageLayout } from '../../../html-pages/page-layout';
import { siteHeader } from '../../../shared-components/site-header';
import { siteFooter } from '../shared-components/site-footer';

export const homePageLayout: PageLayout = (user) => (page) => pipe(
  `
  <div class="home-page-container">
    ${siteHeader(user, 'dark')}

    <main id="mainContent">
      ${page.content}
    </main>

    ${siteFooter(user)}
  </div>
`,
  toContentWrappedInLayout,
);
