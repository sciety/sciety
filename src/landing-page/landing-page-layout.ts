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
    <header class="site-header">
      <div class="site-header__inner">
        <a href="/">
          <img src="/static/images/sciety-logo-blue-text.svg" alt="Sciety">
        </a>

        <nav class="landing-page-utility-bar" aria-describedby="application-utilities">
          <div id="application-utilities" class="hidden">Sciety application utilities</div>
          <ul class="landing-page-utility-bar__list" role="list">
            <li class="landing-page-utility-bar__list_item landing-page-utility-bar__list_item--search">
              <a href="/search">
                <img src="/static/images/search-icon.svg" alt="Search" class="landing-page-utility-bar__list__search_icon">
              </a>
            </li>
            <li class="landing-page-utility-bar__list_item">
              <a href="/log-in" class="landing-page-utility-bar__list_link_button">Log in</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main class="page-content">
      ${page.content}
    </main>

    <footer class="landing-page-footer">
      <ul class="landing-page-footer__links" role="list">
        <li class="landing-page-footer__link"><a href="/about">About</a></li>
        <li class="landing-page-footer__link"><a href="/feedback">Feedback</a></li>
        <li class="landing-page-footer__link"><a href="/blog">Blog</a></li>
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
