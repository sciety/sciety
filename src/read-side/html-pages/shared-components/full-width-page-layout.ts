import { pipe } from 'fp-ts/function';
import { wrapWithHeaderAndFooter } from './wrap-with-header-and-footer';
import { toHtmlFragment } from '../../../types/html-fragment';
import { toContentWrappedInLayout } from '../content-wrapped-in-layout';
import { PageLayout } from '../page-layout';

export const fullWidthPageLayout: PageLayout = (user) => (page) => pipe(
  `
  <main id="mainContent">
    <div class="page-content">
      ${page.content}
    </div>
  </main>
  `,
  toHtmlFragment,
  wrapWithHeaderAndFooter('standard-page-container', user),
  toContentWrappedInLayout,
);
