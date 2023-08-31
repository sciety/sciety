import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { googleTagManagerNoScript } from './analytics';
import { head } from './head';
import { siteFooter } from './site-footer';
import { siteHeader } from './site-header';
import { Page } from '../types/page';
import { UserDetails } from '../types/user-details';

// TODO: return a more specific type e.g. HtmlDocument
export const fullWidthPageLayout = (user: O.Option<UserDetails>) => (page: Page): string => `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns#">
  ${head(
    pipe(
      user,
      O.map((u) => u.id),
    ),
    page,
  )}
<body>
  ${googleTagManagerNoScript()}
  <div class="standard-page-container">
    ${siteHeader(user)}

    <main id="mainContent">
      <div class="page-content">
        ${page.content}
      </div>
    </main>
    ${siteFooter(user)}
  </div>

  <script src="/static/behaviour.js"></script>

</body>
</html>
`;
