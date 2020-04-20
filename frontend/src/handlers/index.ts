import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';
import article1 from '../data/article1';
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
              Cell Biology
            </li>
          </ol>

          <h3>
            <a href="article1">
              ${article1.title}
            </a>
          </h3>

          <ol aria-label="Authors of this article">
            <li>
              Clemens Heissenberger
            </li>
            <li>
              Teresa L. Krammer
            </li>
            <li>
              Jarod A. Rollins
            </li>
            <li>
              Fabian Nagelreiter
            </li>
            <li>
              Isabella Stocker
            </li>
            <li>
              Ludivine Wacheul
            </li>
            <li>
              Anton Shpylovyi
            </li>
            <li>
              Santina Snow
            </li>
            <li>
              Johannes Grillari
            </li>
            <li>
              Aric N. Rogers
            </li>
            <li>
              Denis L.J. Lafontaine
            </li>
            <li>
              Markus Schosserer
            </li>
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
              Cell Biology
            </li>
          </ol>

          <h3>
            <a href="article2">
              KAT2-mediated acetylation switches the mode of PALB2 chromatin association to safeguard genome integrity
            </a>
          </h3>

          <ol aria-label="Authors of this article">
            <li>
              Marjorie Fournier
            </li>
            <li>
              Jean-Yves Bleuyard
            </li>
            <li>
              Anthony M. Couturier
            </li>
            <li>
              Jessica Ellins
            </li>
            <li>
              Svenja Hester
            </li>
            <li>
              Stephen J. Smerdon
            </li>
            <li>
              László Tora
            </li>
            <li>
              Fumiko Esashi
            </li>
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
