import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { RenderPageLayout } from '../../render-page-layout';
import { commonLayout } from '../common-layout';

export const renderStandardPageLayout: RenderPageLayout = (viewModel) => (page) => pipe(
  `
  <main id="mainContent">
    <div class="page-content">
      <div class="sciety-grid-two-columns">
        ${page.content}
      </div>
    </div>
  </main>
  `,
  toHtmlFragment,
  commonLayout('standard-page-container', viewModel.userDetails),
);
