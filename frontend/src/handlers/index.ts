import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';
import article1 from '../data/article1';
import article2 from '../data/article2';
import templatePage from '../templates/page';

export default (): Handler<HTTPVersion.V1> => {
  const page = templatePage(`<main>

  <header>

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

        <article>

          <ol aria-label="Article categories">
            <li>
              ${article1.category}
            </li>
          </ol>

          <h3>
            <a href="article1">
              ${article1.title}
            </a>
          </h3>

          <ol aria-label="Authors of this article">
            ${article1.authors.reduce((carry: string, name: string): string => `${carry}<li>${name}</li>\n`, '')}
          </ol>

          <ul aria-label="Review details">
            <li>
              3 reviews
            </li>
            <li>
              Reviewed <time datetime="2020-04-08">Apr 8, 2020</time> by eLife
            </li>
          </ul>

        </article>

      </li>

      <li>

        <article>

          <ol aria-label="Article categories">
            <li>
              ${article2.category}
            </li>
          </ol>

          <h3>
            <a href="article2">
              ${article2.title}
            </a>
          </h3>

          <ol aria-label="Authors of this article">
            ${article2.authors.reduce((carry: string, name: string): string => `${carry}<li>${name}</li>\n`, '')}
          </ol>

          <ul aria-label="Review details">
            <li>
              4 reviews
            </li>
            <li>
              Reviewed <time datetime="2020-04-09">Apr 9, 2020</time> by EMBOpress
            </li>
          </ul>

        </article>

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
