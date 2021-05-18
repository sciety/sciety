import {
  cookieConsent, googleTagManager, googleTagManagerNoScript,
} from '../shared-components/analytics';
import { head } from '../shared-components/head';
import { Page } from '../types/page';

export const landingPageLayout = (page: Page): string => `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns#">
  ${head(page.title, page.openGraph)}
<body>
  ${googleTagManagerNoScript()}
  <div>
    <header class="landing-page-header">
      <img src="/static/images/sciety-logo-blue-text.svg" alt="Sciety logo">
      <div class="landing-page-header__links_container">
        <a href="https://twitter.com/scietyHQ" class="landing-page-header__follow_link">Follow us</a>
        <a href="/log-in" class="landing-page-header__login_button">Log in</a>
      </div>
    </header>

    <main>
      ${page.content}
    </main>

    <footer class="landing-page-footer">
      <ul class="landing-page-footer__links" role="list">
        <li class="landing-page-footer__link"><a href="/about">About</a></li>
        <li class="landing-page-footer__link"><a href="/feedback">Feedback</a></li>
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

  ${googleTagManager()}
  ${cookieConsent()}
</body>
</html>
`;
