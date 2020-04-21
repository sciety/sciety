import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';
import article2 from '../data/article2';
import templateDate from '../templates/date';
import templateListItems from '../templates/list-items';
import templateReviewSummary from '../templates/review-summary';
import templatePage from '../templates/page';

export default (): Handler<HTTPVersion.V1> => {
  const reviewSummaries = templateListItems(article2.reviews.map((review, index) => templateReviewSummary(review, `review-${index}`)));

  const page = templatePage(`<main>

  <article>

    <header>

      <ol>
        <li aria-label="Article category">
          ${article2.category}
        </li>
        <li aria-label="Article type">
          ${article2.type}
        </li>
      </ol>

      <h1>
        ${article2.title}
      </h1>

      <ol aria-label="Authors of this article" class="author-list">
        ${templateListItems(article2.authors)}
      </ol>

      <ul aria-label="Publication details">
        <li>
          DOI: <a href="https://doi.org/${article2.doi}">${article2.doi}</a>
        </li>
        <li>
          Updated ${templateDate(article2.updatedDate)}
        </li>
      </ul>

    </header>

    <section role="doc-abstract">

      <h2>
        Abstract
      </h2>

      ${article2.abstract}

    </section>

    <section>

      <h2>
        Review summaries
      </h2>

      <ol>
        ${reviewSummaries}
      </ol>

    </section>

    <aside>

      <h2>
        4 peer reviews
      </h2>

      <ol>

        <li>

          <article>

            <h3>
              <a href="https://hypothes.is/a/JFxMDnpkEeqyx09LkDotfQ" aria-label="Review by EMBOpress">EMBOpress</a>
            </h3>

            <time datetime="2020-04-09" aria-label="Review date">Apr 9, 2020</time>

          </article>

        </li>

        <li>

          <article>

            <h3>
              <a href="https://hypothes.is/a/I-FC6HpkEeqdRav-80EtSA" aria-label="Review by EMBOpress">EMBOpress</a>
            </h3>

            <time datetime="2020-04-09" aria-label="Review date">Apr 9, 2020</time>

          </article>

        </li>

        <li>

          <article>

            <h3>
              <a href="https://hypothes.is/a/I36NiHpkEeqdZutVpxr6uQ" aria-label="Review by EMBOpress">EMBOpress</a>
            </h3>

            <time datetime="2020-04-09" aria-label="Review date">Apr 9, 2020</time>

          </article>

        </li>

        <li>

          <article>

            <h3>
              <a href="https://hypothes.is/a/I0iGrHpkEeqtkxu-1NyIbQ" aria-label="Review by EMBOpress">EMBOpress</a>
            </h3>

            <time datetime="2020-04-09" aria-label="Review date">Apr 9, 2020</time>

          </article>

        </li>

      </ol>

      <a href="add-review">Add a review</a>

    </aside>

  </article>

</main>`);

  return (request: IncomingMessage, response: ServerResponse): void => {
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    response.writeHead(OK);
    response.end(page);
  };
};
