import { Maybe } from 'true-myth';
import { User } from '../types/user';

let googleAnalytics = '';
if (process.env.GOOGLE_ANALYTICS_TRACKING_ID) {
  googleAnalytics = `
    const script = document.createElement('script');
    script.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_TRACKING_ID}');
    script.setAttribute('async', '');
    document.body.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', '${process.env.GOOGLE_ANALYTICS_TRACKING_ID}');
  `;
}

let googleTagManager = '';
let googleTagManagerNoScript = '';
if (process.env.GOOGLE_TAG_MANAGER) {
  googleTagManager = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NX7CQB4');
`;

  googleTagManagerNoScript = `
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NX7CQB4"
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

export default (page: string, user: Maybe<User>): string => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">  
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>
    The Hive
  </title>
  <link rel="stylesheet" href="/static/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent/3.1.1/cookieconsent.min.css">
</head>
<body>
  ${googleTagManagerNoScript}
  <header class="u-full-width">

    <nav class="site-header">

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

  <main class="u-full-width">
    ${page}
  </main>

  <script src="/static/behaviour.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent/3.1.1/cookieconsent.min.js"></script>
  <script>
    function onConsent() {
        if (!this.hasConsented()) {
          return;
        }
        ${googleAnalytics}
        ${googleTagManager}
    }

    window.cookieconsent.initialise({
      content: {
        message: 'This site uses cookies to deliver its services and analyse traffic. By using this site, you agree to its use of cookies.'
      },
      onInitialise: onConsent,
      onStatusChange: onConsent,
      palette: {
        popup: {
          background: 'rgb(0, 0, 0, 0.8)',
        }
      }
    });
  </script>
</body>
</html>
`;
