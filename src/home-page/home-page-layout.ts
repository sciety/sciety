import * as O from 'fp-ts/Option';
import { googleTagManagerNoScript } from '../shared-components/analytics';
import { drawer } from '../shared-components/drawer';
import { head } from '../shared-components/head';
import { utilityBar } from '../shared-components/utility-bar';
import { Page } from '../types/page';
import { User } from '../types/user';

export const homePageLayout = (user: O.Option<User>) => (page: Page): string => `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns#">
  ${head(O.none, page)}
<body>
  ${googleTagManagerNoScript()}
  <div class="page-container">
    ${drawer(user)}

    <header class="site-header">
      <div class="site-header__inner">
        <a href="/menu" class="site-header__menu_link">
          <img src="/static/images/menu-icon.svg" alt="" />
        </a>

        ${utilityBar(user)}
      </div>
    </header>

    <main>
      ${page.content}
    </main>

    <footer class="home-page-footer">
      <ul class="home-page-footer__links" role="list">
        <li><a href="/about" class="home-page-footer__link">About</a></li>
        <li><a href="/contact-us" class="home-page-footer__link">Contact us</a></li>
        <li><a href="/blog" class="home-page-footer__link">Blog</a></li>
        <li><a href="https://twitter.com/scietyHQ" class="home-page-footer__link home-page-header__follow_link"><img src="/static/images/twitter-bird.svg" alt="Follow us on Twitter"/></a></li>
        <li><a href="https://www.facebook.com/ScietyHQ/" class="home-page-footer__link home-page-header__follow_link"><img src="/static/images/facebook.svg" alt="Follow us on Facebook"/></a></li>
      </ul>
    </footer>
  </div>

  <script src="/static/behaviour.js"></script>

</body>
</html>
`;
