import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { siteMenuItems } from './site-menu';
import { googleTagManagerNoScript } from '../../shared-components/analytics';
import { head } from '../../shared-components/head';
import { utilityBar } from '../../shared-components/utility-bar';
import { Page } from '../../types/page';
import { toHtmlFragment } from '../../types/html-fragment';
import { UserDetails } from '../../types/user-details';
import { renderSearchIcon } from '../render-search-icon';

// TODO: return a more specific type e.g. HtmlDocument
export const menuPage = (user: O.Option<UserDetails>) => (referer: O.Option<string>) => ({
  title: 'Menu',
  content: toHtmlFragment(`
  ${htmlEscape`<a href="${O.getOrElse(constant('/'))(referer)}" class="menu-page__close_nav"><img src="/static/images/close-icon.svg" alt=""></a>`}

  <main class="menu-page-main-content">
    <nav class="navigation-menu">
      <h1 class="navigation-menu__title">Menu</h1>
      ${siteMenuItems(user)}
    </nav>
  </main>
`),
});

export const menuPageLayout = (user: O.Option<UserDetails>) => (page: Page): string => `<!doctype html>
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

<div class="menu-page-container">

  ${page.content}
  <header class="menu-page-header">
    <a href="/search" class="site-header__search_link">${renderSearchIcon()}<span class="site-header__search_label">Search</span></a>
    ${utilityBar(user)}
  </header>

</div>

  <script src="/static/behaviour.js"></script>

</body>
</html>
`;
