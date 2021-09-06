import * as O from 'fp-ts/Option';
import { googleTagManagerNoScript } from '../shared-components/analytics';
import { head } from '../shared-components/head';
import { Page } from '../types/page';
import { User } from '../types/user';

const loginButton = O.fold(
  () => '<a href="/log-in" class="landing-page-header__login_button">Log in</a>',
  () => '<a href="/log-out" class="landing-page-header__login_button">Log out</a>',
);

export const landingPageLayout = (user: O.Option<User>) => (page: Page): string => `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns#">
  ${head(O.none, page)}
<body>
  ${googleTagManagerNoScript()}
  <div>
    <header class="landing-page-header">
      <img class="landing-page-header__logo" src="/static/images/sciety-logo-blue-text.svg" alt="Sciety logo">
      <a href="/menu" class="landing-page-header__menu_link"><img src="/static/images/menu-icon.svg" alt="" /></a>
      <div class="landing-page-header__link_container">
        <a href="https://twitter.com/scietyHQ" class="landing-page-header__follow_link"><img src="/static/images/twitter-bird.svg" alt="Follow us on Twitter"/></a>
        <a href="https://www.facebook.com/ScietyHQ/" class="landing-page-header__follow_link"><img src="/static/images/facebook.svg" alt="Follow us on Facebook"/></a>
        ${loginButton(user)}
        <a href="/signup" class="landing-page-header__signup_button">Subscribe</a>
      </div>
    </header>

    <main>
      ${page.content}
    </main>

    <footer class="landing-page-footer">
      <ul class="landing-page-footer__links" role="list">
        <li class="landing-page-footer__link"><a href="/about">About</a></li>
        <li class="landing-page-footer__link"><a href="/contact-us">Contact us</a></li>
        <li class="landing-page-footer__link"><a href="/blog">Blog</a></li>
        <li class="landing-page-footer__link"><a href="https://twitter.com/scietyHQ">Follow us</a></li>
      </ul>
      <small class="landing-page-footer__small_print">
        © 2021 eLife Sciences Publications Ltd.
        <a href="/legal">Legal information</a>
      </small>
    </footer>
  </div>

  <script src="/static/behaviour.js"></script>

</body>
</html>
`;
