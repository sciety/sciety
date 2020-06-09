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

      <li>
        <a href="/" class="item">Home</a>
      </li>

      <li>
        <a href="/about" class="item">About</a>
      </li>

    </ul>

  </nav>

</header>

<main class="ui container">
  ${response.body}
</main>`;
  }
);
