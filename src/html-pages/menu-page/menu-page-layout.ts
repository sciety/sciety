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
    <a href="/search" class="site-header__search_link">
      <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Designs" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="results-mobile-broken-down" transform="translate(-367.000000, -169.000000)">
                  <g id="Group" transform="translate(95.000000, 112.000000)">
                      <g id="new/navbar-mobile" transform="translate(0.000000, 36.000000)">
                          <g id="page-tools" transform="translate(168.000000, 12.000000)">
                              <g id="baseline-search-24px" transform="translate(104.000000, 9.000000)">
                                  <path class="site-header__search_icon_path" d="M15.5,14 L14.71,14 L14.43,13.73 C15.41,12.59 16,11.11 16,9.5 C16,5.91 13.09,3 9.5,3 C5.91,3 3,5.91 3,9.5 C3,13.09 5.91,16 9.5,16 C11.11,16 12.59,15.41 13.73,14.43 L14,14.71 L14,15.5 L19,20.49 L20.49,19 L15.5,14 Z M9.5,14 C7.01,14 5,11.99 5,9.5 C5,7.01 7.01,5 9.5,5 C11.99,5 14,7.01 14,9.5 C14,11.99 11.99,14 9.5,14 Z" id="Shape" fill="#34434A" fill-rule="nonzero"/>
                                  <polygon id="Path" points="0 0 24 0 24 24 0 24"/>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
          </g>
      </svg>
<span class="site-header__search_label">Search</span>
    </a>
    ${utilityBar(user)}
  </header>

</div>

  <script src="/static/behaviour.js"></script>

</body>
</html>
`;
