import { pipe } from 'fp-ts/function';
import { commonLayout } from './common-layout';
import { toHtmlFragment } from '../../../types/html-fragment';
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
  commonLayout('standard-page-container', user),
);
