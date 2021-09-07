import * as O from 'fp-ts/Option';
import { googleTagManagerNoScript } from '../shared-components/analytics';
import { drawer } from '../shared-components/drawer';
import { head } from '../shared-components/head';
import { Page } from '../types/page';
import { User } from '../types/user';

const loginButton = O.fold(
  () => '<a href="/log-in" class="home-page-header__login_button">Log in</a>',
  () => '<a href="/log-out" class="home-page-header__login_button">Log out</a>',
);

export const homePageLayout = (user: O.Option<User>) => (page: Page): string => `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns#">
  ${head(O.none, page)}
<body>
  ${googleTagManagerNoScript()}
  <div class="page-container">
    ${drawer(user)}

    <header class="home-page-header">
      <a href="/menu" class="home-page-header__menu_link"><img src="/static/images/menu-icon.svg" alt="" /></a>
      <div class="home-page-header__link_container">
        <a href="https://twitter.com/scietyHQ" class="home-page-header__follow_link"><img src="/static/images/twitter-bird.svg" alt="Follow us on Twitter"/></a>
        <a href="https://www.facebook.com/ScietyHQ/" class="home-page-header__follow_link"><img src="/static/images/facebook.svg" alt="Follow us on Facebook"/></a>
        ${loginButton(user)}
        <a href="/signup" class="home-page-header__signup_button">Subscribe</a>
      </div>
    </header>

    <main>
      ${page.content}
    </main>

    <footer class="home-page-footer">
      <ul class="home-page-footer__links" role="list">
        <li class="home-page-footer__link"><a href="/about">About</a></li>
        <li class="home-page-footer__link"><a href="/contact-us">Contact us</a></li>
        <li class="home-page-footer__link"><a href="/blog">Blog</a></li>
        <li class="home-page-footer__link"><a href="https://twitter.com/scietyHQ">Follow us</a></li>
      </ul>
    </footer>
  </div>

  <script src="/static/behaviour.js"></script>

</body>
</html>
`;
