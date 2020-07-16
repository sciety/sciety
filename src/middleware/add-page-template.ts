import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';

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

export default (): Middleware => (
  async ({ response }: RouterContext, next: Next): Promise<void> => {
    response.type = 'html';
    await next();
    if (typeof response.body !== 'string') {
      throw new Error('Response body must be a string');
    }
    response.body = `<!doctype html>

<meta charset="utf-8">

<meta name="viewport" content="width=device-width, initial-scale=1">

<title>
  Untitled Publish Review Curate Platform
</title>

<link rel="stylesheet" href="/static/style.css">

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent/3.1.1/cookieconsent.min.css">

<header class="ui container">

  <nav>

    <ul class="ui large text menu">

      <li class="item">
        <a href="/">Home</a>
      </li>

      <li class="item">
        <a href="/about">About</a>
      </li>

      <li class="right item">
        <a href="https://eepurl.com/g7qqcv" class="ui primary button">Give us feedback</a>
      </li>

    </ul>

  </nav>

</header>

<main class="ui container">
  ${response.body}
</main>

<script src="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent/3.1.1/cookieconsent.min.js"></script>
<script>
  function onConsent() {
      if (!this.hasConsented()) {
        return;
      }
      ${googleAnalytics}
  }
  
  window.cookieconsent.initialise({
    onInitialise: onConsent,
    onStatusChange: onConsent,
    palette: {
      popup: {
        background: 'rgb(0, 0, 0, 0.8)',
      }
    }
  });
</script>
`;
  }
);
