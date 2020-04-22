import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';
import article1 from '../data/article1';
import article2 from '../data/article2';
import templateArticleTeaser from '../templates/article-teaser';
import templatePage from '../templates/page';
import templateListItems from '../templates/list-items';

export default (): Handler<HTTPVersion.V1> => {
  const articles = [
    article1,
    article2,
  ];
  const teasers = articles.map((article) => templateArticleTeaser(article, `/articles/${encodeURIComponent(article.doi)}`));
  const page = templatePage(`<main>

  <header class="content-header">

    <h1>
      PRC
    </h1>

  </header>

  <section class="teaser-list">

    <h2 class="teaser-list__title">
      Recently reviewed articles
    </h2>

    <ol class="teaser-list__list">
      ${templateListItems(teasers)}
    </ol>

  </section>

</main>`);

  return (request: IncomingMessage, response: ServerResponse): void => {
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    response.writeHead(OK);
    response.end(page);
  };
};
