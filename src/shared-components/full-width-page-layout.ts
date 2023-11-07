import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { googleTagManagerNoScript } from './analytics';
import { head } from './head';
import { siteFooter } from './site-footer';
import { siteHeader } from './site-header';
import { PageLayout } from '../html-pages/page-layout';
import { UserDetails } from '../types/user-details';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { HtmlPage } from '../html-pages/html-page';

const wrapInHtmlDocument = (user: O.Option<UserDetails>, page: HtmlPage) => (styledContent: HtmlFragment) => `
  <!doctype html>
  <html lang="en" prefix="og: http://ogp.me/ns#">
    ${head(pipe(user, O.map((u) => u.id)), page)}
  <body>
    ${googleTagManagerNoScript()}
    ${styledContent}

    <script src="/static/behaviour.js"></script>

  </body>
  </html>
`;

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
  toHtmlFragment,
  wrapInHtmlDocument(user, page),
);
