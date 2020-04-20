import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';

type HTML = string;

function page(): HTML {
  return `<!doctype html>

<meta charset="utf-8">

<title>
  PRC
</title>

<link rel="stylesheet" href="style.css">

<header>

  <nav>

    <ul>

      <li>
        <a href="./">Home</a>
      </li>

    </ul>

  </nav>

</header>

<main>

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
            <a href="article1.html">
              The ribosomal RNA m<sup>5</sup>C methyltransferase NSUN-1 modulates healthspan and
              oogenesis in <i>Caenorhabditis elegans</i>
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
            <a href="article2.html">
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

</main>`;
}

export default (): Handler<HTTPVersion.V1> => (
  (request: IncomingMessage, response: ServerResponse): void => {
    response.setHeader('Cache-Control', 'no-store, must-revalidate');
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    response.writeHead(OK);
    response.end(page());
  }
);
