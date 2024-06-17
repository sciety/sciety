import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../../types/html-fragment';
import { toContentWrappedInLayout } from '../content-wrapped-in-layout';
import { PageLayout } from '../page-layout';
import { wrapWithHeaderAndFooter } from '../shared-components/wrap-with-header-and-footer';

export const homePageLayout: PageLayout = (user) => (page) => pipe(
  `
  <main id="mainContent">
    ${page.content}
  </main>
  `,
  toHtmlFragment,
  wrapWithHeaderAndFooter('home-page-container', user, 'dark'),
  toContentWrappedInLayout,
);
