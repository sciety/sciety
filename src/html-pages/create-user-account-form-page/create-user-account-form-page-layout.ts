import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { googleTagManagerNoScript } from '../../shared-components/analytics';
import { head } from '../../shared-components/head';
import { siteFooter } from '../../shared-components/site-footer';
import { siteHeader } from '../../shared-components/site-header';
import { Page } from '../../types/page';
import { UserDetails } from '../../types/user-details';

export const createUserAccountFormPageLayout = (user: O.Option<UserDetails>) => (page: Page): string => `<!doctype html>
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
  <div class="create-user-account-form-page__container">
    ${siteHeader(user)}

    <main id="mainContent" class="create-user-account-form-page__main">
      ${page.content}
    </main>

    ${siteFooter(user)}
  </div>

  <script src="/static/behaviour.js"></script>

</body>
</html>
`;
