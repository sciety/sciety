import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

const renderCookieBotScript = `
  <script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="56f22051-f915-4cf1-9552-7d8f64d81152" data-blockingmode="auto"></script>
`;

const cookieBot = (): HtmlFragment => pipe(
  process.env.DISABLE_COOKIEBOT,
  O.fromNullable,
  O.filter((disableCookieBot) => disableCookieBot === 'true'),
  O.fold(
    constant(renderCookieBotScript),
    constant(''),
  ),
  toHtmlFragment,
);

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
      'analytics_storage': 'denied',
      'wait_for_update': 500,
    });
    gtag("set", "ads_data_redaction", true);
  </script>

  ${cookieBot()}

  <script data-cookieconsent="ignore">
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

const renderFathomScript = (fathomId: string) => `
  <script src="https://cdn.usefathom.com/script.js" data-site="${fathomId}" defer></script>
`;

const renderIntercomScript = (intercomAppId: string) => `
  <script>
  window.intercomSettings = {
    app_id: "${intercomAppId}"
  };
  </script>

  <script>
  // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/j1i1ayq1'
  (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/j1i1ayq1';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
  </script>
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

export const fathom = (): HtmlFragment => pipe(
  process.env.FATHOM_SITE_ID,
  O.fromNullable,
  O.fold(
    constant(''),
    renderFathomScript,
  ),
  toHtmlFragment,
);

export const intercom = (): HtmlFragment => pipe(
  process.env.INTERCOM_APP_ID,
  O.fromNullable,
  O.fold(
    constant(''),
    renderIntercomScript,
  ),
  toHtmlFragment,
);
