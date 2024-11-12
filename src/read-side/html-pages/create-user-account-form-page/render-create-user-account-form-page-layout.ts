import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../../types/html-fragment';
import { RenderPageLayout } from '../render-page-layout';
import { commonLayout } from '../shared-components/common-layout';

export const renderCreateUserAccountFormPageLayout: RenderPageLayout = (viewModel) => (page) => pipe(
  `
  <main id="mainContent" class="create-user-account-form-page__main">
    <div class="page-content">
      ${page.content}
    </div>
  </main>
  `,
  toHtmlFragment,
  commonLayout('create-user-account-form-page__container', viewModel.userDetails),
);
