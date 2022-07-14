import * as O from 'fp-ts/Option';
import { googleTagManagerNoScript } from '../shared-components/analytics';
import { head } from '../shared-components/head';
import { siteHeader } from '../shared-components/site-header';
import { Page } from '../types/page';
import { User } from '../types/user';

export const homePageLayout = (user: O.Option<User>) => (page: Page): string => `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns#">
  ${head(O.none, page)}
<body>
  ${googleTagManagerNoScript()}
  <div class="page-container">
    ${siteHeader(user)}

    <main>
      ${page.content}
    </main>

    <footer class="home-page-footer">
      <ul class="home-page-footer__links" role="list">
        <li><a href="/about" class="home-page-footer__link">About</a></li>
        <li><a href="/contact-us" class="home-page-footer__link">Contact us</a></li>
        <li><a href="/blog" class="home-page-footer__link">Blog</a></li>
        <li><a href="https://twitter.com/scietyHQ" class="home-page-footer__link"><img src="/static/images/twitter-bird.svg" alt="Follow us on Twitter"/></a></li>
        <li><a href="https://www.facebook.com/ScietyHQ/" class="home-page-footer__link"><img src="/static/images/facebook.svg" alt="Follow us on Facebook"/></a></li>
      </ul>
    </footer>
  </div>

  <script src="/static/behaviour.js"></script>

</body>
</html>
`;
