import { htmlEscape } from 'escape-goat';
import { Maybe } from 'true-myth';
import { User } from '../types/user';

let googleTagManager = '';
let googleTagManagerNoScript = '';
if (process.env.GOOGLE_TAG_MANAGER_ID) {
  googleTagManager = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.GOOGLE_TAG_MANAGER_ID}');
`;

  googleTagManagerNoScript = `
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.GOOGLE_TAG_MANAGER_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
}

const loggedInMenuItems = (user: User): string => `
  <li class="item">
    <a href="/users/${user.id}">My profile</a>
  </li>

  <li class="item">
    <a href="/log-out">Log out</a>
  </li>
`;

const loggedOutMenuItems = (): string => `
  <li class="item">
    <a href="/log-in">Log in</a>
  </li>
`;

const isSecure = process.env.APP_ORIGIN !== undefined && process.env.APP_ORIGIN.startsWith('https:');

type Page = {
  content: string;
  openGraph?: {
    title: string;
    description: string;
  }
};

export default (page: Page, user: Maybe<User>): string => `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns#">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>
    Sciety
  </title>
  <link rel="stylesheet" href="/static/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent/3.1.1/cookieconsent.min.css">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="@scietyHQ">
  <meta property="og:site_name" content="Sciety">
  <meta property="og:title" content="${htmlEscape(page.openGraph ? page.openGraph.title : 'Sciety')}">
  <meta property="og:description" content="${htmlEscape(page.openGraph ? page.openGraph.description : 'Where research is evaluated and curated by the communities you trust')}">
  <meta property="og:image" content="${process.env.APP_ORIGIN ?? ''}/static/images/sciety-twitter-profile.png">
</head>
<body>
  ${googleTagManagerNoScript}
  <header class="site-header">

    <nav>

      <ul class="ui large text menu">

        <li class="item">
          <a href="/">Home</a>
        </li>

        <li class="item">
          <a href="/about">About</a>
        </li>

        ${user.mapOrElse(loggedOutMenuItems, loggedInMenuItems)}

        <li class="right item">
          <a href="https://eepurl.com/g7qqcv" class="button button--primary">Give us feedback</a>
        </li>

      </ul>

    </nav>

  </header>

  <main>
    ${page.content}
  </main>

  <footer class="site-footer">
    <p>Sciety is operated by a team based within eLife Sciences Publications Limited. It is steered by all of its communities, readers and authors.</p>

    <div class="site-footer__container">
      <ul class="site-footer__links_list" role="list">
        <li><a href="/terms">Terms and conditions</a></li>
        <li><a href="/privacy">Privacy notice</a></li>
      </ul>

      <small class="site-footer__company_information">
        eLife Sciences Publications, Ltd is a limited liability non-profit non-stock corporation incorporated
        in the State of Delaware, USA, with company number 5030732, and is registered in the UK with company
        number FC030576 and branch number BR015634 at the address:
      </small>

      <address class="site-footer__address">
        eLife Sciences Publications, Ltd<br>
        Westbrook Centre, Milton Road<br>
        Cambridge CB4 1YG<br>
        UK
      </address>

      <small>
        © 2020 eLife Sciences Publications Ltd. Subject to a Creative Commons Attribution license, except where otherwise
        noted.
      </small>
    </div>

  </footer>

  <script src="/static/behaviour.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent/3.1.1/cookieconsent.min.js"></script>
  <script>
    function onConsent() {
        if (!this.hasConsented()) {
          return;
        }
        ${googleTagManager}
    }

    window.cookieconsent.initialise({
      content: {
        message: 'This site uses cookies to deliver its services and analyse traffic. By using this site, you agree to its use of cookies.',
        href: '/privacy',
        target: '_self'
      },
      onInitialise: onConsent,
      onStatusChange: onConsent,
      palette: {
        popup: {
          background: 'rgb(0, 0, 0, 0.8)',
        }
      },
      cookie: {
        secure: ${isSecure ? 'true' : 'false'}
      },
    });
  </script>
</body>
</html>
`;
