import { pipe } from 'fp-ts/function';
import { siteFooter } from './site-footer/index.js';
import { siteHeader } from './site-header/index.js';
import { PageLayout } from '../html-pages/page-layout.js';
import { toContentWrappedInLayout } from '../html-pages/content-wrapped-in-layout.js';

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
);
