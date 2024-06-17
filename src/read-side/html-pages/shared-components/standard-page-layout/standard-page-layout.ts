import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { toContentWrappedInLayout } from '../../content-wrapped-in-layout';
import { PageLayout } from '../../page-layout';
import { wrapWithHeaderAndFooter } from '../wrap-with-header-and-footer';

export const standardPageLayout: PageLayout = (user) => (page) => pipe(
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
  wrapWithHeaderAndFooter('standard-page-container', user),
  toContentWrappedInLayout,
);
