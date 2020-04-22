import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';
import fetchAllArticles from '../api/fetch-all-articles';
import templateArticleTeaser from '../templates/article-teaser';
import templateListItems from '../templates/list-items';
import templatePage from '../templates/page';

export default (): Handler<HTTPVersion.V1> => {
  const teasers = fetchAllArticles().map((reviewedArticle) => templateArticleTeaser(reviewedArticle, `/articles/${encodeURIComponent(reviewedArticle.doi)}`));
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
