import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../../types/html-fragment';
import { toContentWrappedInLayout } from '../content-wrapped-in-layout';
import { PageLayout } from '../page-layout';
import { wrapWithHeaderAndFooter } from '../shared-components/wrap-with-header-and-footer';

export const createUserAccountFormPageLayout: PageLayout = (user) => (page) => pipe(
  `
  <main id="mainContent" class="create-user-account-form-page__main">
    <div class="page-content">
      ${page.content}
    </div>
  </main>
  `,
  toHtmlFragment,
  wrapWithHeaderAndFooter('create-user-account-form-page__container', user),
  toContentWrappedInLayout,
);
