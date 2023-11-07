import { pipe } from 'fp-ts/function';
import { siteFooter } from '../../shared-components/site-footer';
import { siteHeader } from '../../shared-components/site-header';
import { PageLayout } from '../page-layout';
import { toHtmlFragment } from '../../types/html-fragment';
import { wrapInHtmlDocument } from '../wrap-in-html-document';

export const homePageLayout: PageLayout = (user) => (page) => pipe(
  `
  <div class="home-page-container">
    ${siteHeader(user, 'dark')}

    <main id="mainContent">
      ${page.content}
    </main>

    ${siteFooter(user)}
  </div>
`,
  toHtmlFragment,
  wrapInHtmlDocument(user, page),
);
