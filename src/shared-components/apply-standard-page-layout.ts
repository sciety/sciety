import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import {
  cookieConsent, fathom, googleTagManager, googleTagManagerNoScript,
} from './analytics';
import { siteMenuFooter, siteMenuItems } from './site-menu';
import { utilityBar } from './utility-bar';
import { Page } from '../types/page';
import { User } from '../types/user';

// TODO: return a more specific type e.g. HtmlDocument
export const applyStandardPageLayout = (user: O.Option<User>) => (page: Page): string => `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns#">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>
    ${htmlEscape(page.title)}
  </title>
  <link rel="stylesheet" href="/static/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent/3.1.1/cookieconsent.min.css">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="@scietyHQ">
  <meta property="og:site_name" content="Sciety">
  <meta property="og:title" content="${htmlEscape(page.openGraph ? page.openGraph.title : 'Sciety')}">
  <meta property="og:description" content="${htmlEscape(page.openGraph ? page.openGraph.description : 'Where research is evaluated and curated by the communities you trust')}">
  <meta property="og:image" content="${process.env.APP_ORIGIN ?? ''}/static/images/sciety-twitter-profile.png">
  <link rel="icon" type="image/svg+xml" href="/static/images/favicons/favicon.svg">

  <link rel="apple-touch-icon" sizes="180x180" href="/static/images/favicons/generated/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/static/images/favicons/generated/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/static/images/favicons/generated/favicon-16x16.png">
  <link rel="manifest" href="/static/images/favicons/generated/site.webmanifest">
  <link rel="mask-icon" href="/static/images/favicons/generated/safari-pinned-tab.svg" color="#cf4500">
  <link rel="shortcut icon" href="/static/images/favicons/generated/favicon.ico">
  <meta name="msapplication-TileColor" content="#cf4500">
  <meta name="msapplication-config" content="/static/images/favicons/generated/browserconfig.xml">
  <meta name="theme-color" content="#ffffff">
  ${fathom()}
</head>
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
      <div class="site-header__wrapper">
        <a href="/menu" class="site-header__menu_link">
          <img src="/static/images/menu-icon.svg" alt="" />
        </a>

        ${utilityBar(user, 'utility-bar--standard-page')}
      </div>
    </header>

    <main class="page-content">
      ${page.content}
    </main>
  </div>

  <script src="/static/behaviour.js"></script>

  ${googleTagManager()}
  ${cookieConsent()}
</body>
</html>
`;
