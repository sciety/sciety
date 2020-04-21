import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';
import article1 from '../data/article1';
import templateDate from '../templates/date';
import templateListItems from '../templates/list-items';
import templateReviewSummary from '../templates/review-summary';
import templatePage from '../templates/page';

export default (): Handler<HTTPVersion.V1> => {
  const reviewSummaries = templateListItems(article1.reviews.map((review, index) => templateReviewSummary(review, `review-${index}`)));

  const page = templatePage(`<main>

  <article>

    <header>

      <ol>
        <li aria-label="Article category">
          ${article1.category}
        </li>
        <li aria-label="Article type">
          ${article1.type}
        </li>
      </ol>

      <h1>
        ${article1.title}
      </h1>

      <ol aria-label="Authors of this article">
        ${templateListItems(article1.authors)}
      </ol>

      <ul aria-label="Publication details">
        <li>
          DOI: <a href="https://doi.org/${article1.doi}">${article1.doi}</a>
        </li>
        <li>
          Posted ${templateDate(article1.publicationDate)}
        </li>
      </ul>

    </header>

    <section role="doc-abstract">

      <h2>
        Abstract
      </h2>

      ${article1.abstract}

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
        ${article1.reviews.length} peer reviews
      </h2>

      <ol>

        <li>

          <article>

            <h3>
              <a href="${article1.reviews[2].url}"
                aria-label="Review by ${article1.reviews[2].author}">${article1.reviews[2].author}</a>
            </h3>

            ${templateDate(article1.reviews[2].publicationDate)}

          </article>


        </li>

        <li>

          <article>

            <h3>
              <a href="${article1.reviews[1].url}"
                aria-label="Review by ${article1.reviews[1].author}">${article1.reviews[1].author}</a>
            </h3>

            ${templateDate(article1.reviews[1].publicationDate)}

          </article>

        </li>

        <li>

          <article>

            <h3>
              <a href="${article1.reviews[0].url}"
                aria-label="Review by ${article1.reviews[0].author}">${article1.reviews[0].author}</a>
            </h3>

            ${templateDate(article1.reviews[0].publicationDate)}

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
