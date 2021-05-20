import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

const renderCookieConsentScripts = (isSecure: boolean) => `
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent/3.1.1/cookieconsent.min.js"></script>
  <script>
    function onConsent() {
      if (!this.hasConsented()) {
        return;
      }
      gtag('consent', 'update', {
        'ad_storage': 'denied',
        'analytics_storage': 'granted'
      });
    }

    window.cookieconsent.hasTransition = false;
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
          background: 'rgba(0, 0, 0, 0.8)',
        }
      },
      cookie: {
        secure: ${isSecure ? 'true' : 'false'}
      },
    });
  </script>
`;

const globalIsSecure = process.env.APP_ORIGIN !== undefined && process.env.APP_ORIGIN.startsWith('https:'); // TODO: get into pipe?

const cookieConsent = (): HtmlFragment => pipe(
  process.env.GOOGLE_TAG_MANAGER_ID,
  O.fromNullable,
  O.fold(
    constant(''),
    () => renderCookieConsentScripts(globalIsSecure),
  ),
  toHtmlFragment,
);

const renderPageLoadedByLoggedInUserEvent = O.fold(
  constant(''),
  (userId: UserId) => `
    gtag({
      'event' : 'page_loaded_by_logged_in_user',
      'user' : {
        'id' : '${userId}',
      }
    });
  `,
);

const renderTagManagerScript = (userId: O.Option<UserId>) => (tagManagerId: string) => `
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}

    gtag('consent', 'default', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied'
    });

  </script>
  ${cookieConsent()}
  <script>

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
