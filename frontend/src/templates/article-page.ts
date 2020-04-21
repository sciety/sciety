import templateListItems from './list-items';
import templateReviewSummary from './review-summary';
import templateReviewSidebarItem from './review-sidebar-item';
import templateArticlePageHeader from './article-page-header';
import { Article } from './types/article';

export default (article: Article): string => {
  const reviewSummaries = templateListItems(article.reviews.map((review, index) => templateReviewSummary(review, `review-${index}`)));
  const reviewSidebarItems = templateListItems(article.reviews.map((review) => templateReviewSidebarItem(review)));
  return `<article>

    ${templateArticlePageHeader(article)}

    <div class="content">

      <section role="doc-abstract">
        <h2>
          Abstract
        </h2>
        ${article.abstract}
      </section>

      <section class="review-summary-list">
        <h2>
          Review summaries
        </h2>
        <ol class="review-summary-list__list">
          ${reviewSummaries}
        </ol>
      </section>

    </div>

    <aside>
      <h2>
        ${article.reviews.length} peer reviews
      </h2>
      <ol>
        ${reviewSidebarItems}
      </ol>
      <a href="/add-review">Add a review</a>
    </aside>

  </article>`;
};
