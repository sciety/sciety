import { pipe } from 'fp-ts/function';
import { siteHeader } from '../../../shared-components/site-header';
import { toContentWrappedInLayout } from '../content-wrapped-in-layout';
import { PageLayout } from '../page-layout';
import { siteFooter } from '../shared-components/site-footer';

export const createUserAccountFormPageLayout: PageLayout = (user) => (page) => pipe(
  `
  <div class="create-user-account-form-page__container">
    ${siteHeader(user)}

    <main id="mainContent" class="create-user-account-form-page__main">
      <div class="page-content">
        ${page.content}
      </div>
    </main>

    ${siteFooter(user)}
  </div>
  `,
  toContentWrappedInLayout,
);
