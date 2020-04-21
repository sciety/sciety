import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';
import article1 from '../data/article1';
import article2 from '../data/article2';
import templateArticleTeaser from '../templates/article-teaser';
import templatePage from '../templates/page';

export default (): Handler<HTTPVersion.V1> => {
  const page = templatePage(`<main>

  <header class="content-header">

    <h1>
      PRC
    </h1>

  </header>

  <section>

    <h2>
      Recently reviewed articles
    </h2>

    <ol>

      <li>
        ${templateArticleTeaser(article1, `/articles/${encodeURIComponent(article1.doi)}`)}
      </li>

      <li>
        ${templateArticleTeaser(article2, `/articles/${encodeURIComponent(article2.doi)}`)}
      </li>

    </ol>

  </section>

</main>`);

  return (request: IncomingMessage, response: ServerResponse): void => {
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    response.writeHead(OK);
    response.end(page);
  };
};
