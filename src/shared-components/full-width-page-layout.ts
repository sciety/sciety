import { pipe } from 'fp-ts/function';
import { siteFooter } from './site-footer';
import { siteHeader } from './site-header';
import { PageLayout } from '../html-pages/page-layout';
import { wrapInHtmlDocument } from '../html-pages/wrap-in-html-document';
import { toContentWrappedInLayout } from '../html-pages/content-wrapped-in-layout';

export const fullWidthPageLayout: PageLayout = (user) => (page) => pipe(
  `
    <div class="standard-page-container">
      ${siteHeader(user)}

      <main id="mainContent">
        <div class="page-content">
          ${page.content}
        </div>
      </main>
      ${siteFooter(user)}
    </div>
  `,
  toContentWrappedInLayout,
  wrapInHtmlDocument(user, page),
);
