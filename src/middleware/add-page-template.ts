import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';

let googleAnalytics = '';
if (process.env.GOOGLE_ANALYTICS_TRACKING_ID) {
  googleAnalytics = `<!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_TRACKING_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${process.env.GOOGLE_ANALYTICS_TRACKING_ID}');
  </script>
  `;
}

export default (): Middleware => (
  async ({ response }: RouterContext, next: Next): Promise<void> => {
    response.type = 'html';
    await next();
    response.body = `<!doctype html>

<meta charset="utf-8">

<meta name="viewport" content="width=device-width, initial-scale=1">

<title>
  Untitled Publish Review Curate Platform
</title>

<link rel="stylesheet" href="/static/style.css">

${googleAnalytics}

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
</main>`;
  }
);
