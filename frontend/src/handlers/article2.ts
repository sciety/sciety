import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';
import article2 from '../data/article2';
import templateDate from '../templates/date';
import templateListItems from '../templates/list-items';
import templateReviewSummary from '../templates/review-summary';
import templateReviewSidebarItem from '../templates/review-sidebar-item';
import templatePage from '../templates/page';

export default (): Handler<HTTPVersion.V1> => {
  const reviewSummaries = templateListItems(article2.reviews.map((review, index) => templateReviewSummary(review, `review-${index}`)));
  const reviewSidebarItems = templateListItems(article2.reviews.map((review) => templateReviewSidebarItem(review)));

  const page = templatePage(`<article>

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

    <div class="content">

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

    </div>

    <aside>

      <h2>
        ${article2.reviews.length} peer reviews
      </h2>

      <ol>
        ${reviewSidebarItems}
      </ol>

      <a href="add-review">Add a review</a>

    </aside>

  </article>`);

  return (request: IncomingMessage, response: ServerResponse): void => {
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    response.writeHead(OK);
    response.end(page);
  };
};
