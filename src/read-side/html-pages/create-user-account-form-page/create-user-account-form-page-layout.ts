import { pipe } from 'fp-ts/function';
import { toContentWrappedInLayout } from '../content-wrapped-in-layout';
import { mobileMenu } from '../mobile-menu/mobile-menu';
import { PageLayout } from '../page-layout';
import { siteFooter } from '../shared-components/site-footer';
import { siteHeader } from '../shared-components/site-header';

export const createUserAccountFormPageLayout: PageLayout = (user) => (page) => pipe(
  `
  <div class="create-user-account-form-page__container">
    ${siteHeader(user)}

    <main id="mainContent" class="create-user-account-form-page__main">
      <div class="page-content">
        ${page.content}
      </div>
    </main>

    ${siteFooter}
  </div>
  ${mobileMenu(user)}
  `,
  toContentWrappedInLayout,
);
