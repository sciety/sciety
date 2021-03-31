import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { constant } from 'fp-ts/function';
import {
  cookieConsent, fathom, googleTagManager, googleTagManagerNoScript,
} from '../shared-components/analytics';
import { siteMenuFooter, siteMenuItems } from '../shared-components/site-menu';
import { utilityBar } from '../shared-components/utility-bar';
import { User } from '../types/user';

// TODO: return a more specific type e.g. HtmlDocument
export const menuPageLayout = (user: O.Option<User>, referer: O.Option<string>): string => `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns#">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>
    Menu | Sciety
  </title>
  <link rel="stylesheet" href="/static/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent/3.1.1/cookieconsent.min.css">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="@scietyHQ">
  <meta property="og:site_name" content="Sciety">
  <meta property="og:title" content="Menu | Sciety">
  <meta property="og:description" content="Where research is evaluated and curated by the communities you trust">
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

<div class="menu-page-container">

  ${htmlEscape`<a href="${O.getOrElse(constant('/'))(referer)}" class="menu-page__close_nav"><img src="/static/images/close-icon.svg" alt=""></a>`}

  <main class="menu-page-main-content">
    <nav class="navigation-menu">
      <h1 class="navigation-menu__title">Menu</h1>
      ${siteMenuItems(user)}
      ${siteMenuFooter}
    </nav>
  </main>

  ${utilityBar(user, 'utility-bar--menu-page')}

</div>

  <script src="/static/behaviour.js"></script>

  ${googleTagManager()}
  ${cookieConsent()}

</body>
</html>
`;
