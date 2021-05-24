import * as O from 'fp-ts/Option';
import { googleTagManagerNoScript } from './analytics';
import { head } from './head';
import { siteMenuFooter, siteMenuItems } from './site-menu';
import { utilityBar } from './utility-bar';
import { Page } from '../types/page';
import { User } from '../types/user';

// TODO: return a more specific type e.g. HtmlDocument
export const applyStandardPageLayout = (user: O.Option<User>) => (page: Page): string => `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns#">
  ${head(user, page.title, page.openGraph)}
<body>
  ${googleTagManagerNoScript()}
  <div class="page-container">
    <nav class="drawer">
      <a href="/" class="drawer__logo_link" aria-hidden="true">
        <img src="/static/images/sciety-logo-white-text.svg " alt="Sciety" class="drawer__logo">
      </a>

      ${siteMenuItems(user)}
      ${siteMenuFooter}

    </nav>
    <header class="site-header">
      <div class="site-header__inner">
        <a href="/menu" class="site-header__menu_link">
          <img src="/static/images/menu-icon.svg" alt="" />
        </a>

        ${utilityBar(user)}
      </div>
    </header>

    <main class="page-content">
      ${page.content}
    </main>
  </div>

  <script src="/static/behaviour.js"></script>

</body>
</html>
`;
