import * as O from 'fp-ts/Option';
import { googleTagManagerNoScript } from '../shared-components/analytics';
import { head } from '../shared-components/head';
import { siteFooter } from '../shared-components/site-footer';
import { siteHeader } from '../shared-components/site-header';
import { Page } from '../types/page';
import { User } from '../types/user';

export const homePageLayout = (user: O.Option<User>) => (page: Page): string => `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns#">
  ${head(O.none, page)}
<body>
  ${googleTagManagerNoScript()}
  <div class="page-container">
    ${siteHeader(user)}

    <main>
      ${page.content}
    </main>

    ${siteFooter}
  </div>

  <script src="/static/behaviour.js"></script>

</body>
</html>
`;
