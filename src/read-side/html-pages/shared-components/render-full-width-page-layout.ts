import { pipe } from 'fp-ts/function';
import { commonLayout } from './common-layout';
import { toHtmlFragment } from '../../../types/html-fragment';
import { RenderPageLayout } from '../render-page-layout';

export const renderFullWidthPageLayout: RenderPageLayout = (viewModel) => (page) => pipe(
  `
  <main id="mainContent">
    <div class="page-content">
      ${page.content}
    </div>
  </main>
  `,
  toHtmlFragment,
  commonLayout('standard-page-container', viewModel.userDetails),
);
