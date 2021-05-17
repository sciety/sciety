import * as O from 'fp-ts/Option';
import {
  cookieConsent, googleTagManager, googleTagManagerNoScript,
} from '../shared-components/analytics';
import { head } from '../shared-components/head';
import { utilityBar } from '../shared-components/utility-bar';
import { Page } from '../types/page';
import { User } from '../types/user';

// TODO: return a more specific type e.g. HtmlDocument
export const landingPageLayout = (user: O.Option<User>) => (page: Page): string => `<!doctype html>
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

        ${utilityBar(user)}
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
