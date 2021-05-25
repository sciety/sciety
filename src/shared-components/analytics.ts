import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

const renderPageLoadedByLoggedInUserEvent = O.fold(
  constant(''),
  (userId: UserId) => `
    dataLayer.push({
      'event' : 'page_loaded_by_logged_in_user',
      'user' : {
        'id' : '${userId}',
      }
    });
  `,
);

const renderTagManagerScript = (userId: O.Option<UserId>) => (tagManagerId: string) => `
  <script data-cookieconsent="ignore">
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}

    gtag('consent', 'default', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied'
    });
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${tagManagerId}');
    ${renderPageLoadedByLoggedInUserEvent(userId)}
  </script>
`;

const renderTagManagerNoScript = (tagManagerId: string) => `
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${tagManagerId}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
`;

const renderCookieBotScript = `
  <script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="56f22051-f915-4cf1-9552-7d8f64d81152" data-blockingmode="auto"></script>
`;

const renderFathomScript = (fathomId: string) => `
  <script src="https://cdn.usefathom.com/script.js" data-site="${fathomId}" defer></script>
`;

export const googleTagManager = (userId: O.Option<UserId>): HtmlFragment => pipe(
  process.env.GOOGLE_TAG_MANAGER_ID,
  O.fromNullable,
  O.fold(
    constant(''),
    renderTagManagerScript(userId),
  ),
  toHtmlFragment,
);

export const googleTagManagerNoScript = (): HtmlFragment => pipe(
  process.env.GOOGLE_TAG_MANAGER_ID,
  O.fromNullable,
  O.fold(
    constant(''),
    renderTagManagerNoScript,
  ),
  toHtmlFragment,
);

export const cookieBot = (): HtmlFragment => pipe(
  process.env.DISABLE_COOKIEBOT,
  O.fromNullable,
  O.filter((disableCookieBot) => disableCookieBot === 'true'),
  O.fold(
    constant(renderCookieBotScript),
    constant(''),
  ),
  toHtmlFragment,
);

export const fathom = (): HtmlFragment => pipe(
  process.env.FATHOM_SITE_ID,
  O.fromNullable,
  O.fold(
    constant(''),
    renderFathomScript,
  ),
  toHtmlFragment,
);
