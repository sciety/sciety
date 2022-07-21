import * as O from 'fp-ts/Option';
import { googleTagManagerNoScript } from './analytics';
import { head } from './head';
import { siteFooter } from './site-footer';
import { siteHeader } from './site-header';
import { Page } from '../types/page';
import { User } from '../types/user';

// TODO: return a more specific type e.g. HtmlDocument
export const standardPageLayout = (user: O.Option<User>) => (page: Page): string => `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns#">
  ${head(user, page)}
<body>
  ${googleTagManagerNoScript()}
  <div class="page-container">
    ${siteHeader(user)}

    <main class="page-content">
      <div class="sciety-grid-two-columns">
        ${page.content}
      </div>
    </main>

    ${siteFooter}
  </div>

  <script src="/static/behaviour.js"></script>

</body>
</html>
`;
