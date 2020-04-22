import templateListItems from './list-items';
import templateReviewSummary from './review-summary';
import templateReviewSidebarItem from './review-sidebar-item';
import templateArticlePageHeader from './article-page-header';
import { ReviewedArticle } from '../types/reviewed-article';

export default (reviewedArticle: ReviewedArticle): string => {
  const reviewSummaries = reviewedArticle.reviews.map((review, index) => templateReviewSummary(review, `review-${index}`));
  const reviewSidebarItems = reviewedArticle.reviews.map((review) => templateReviewSidebarItem(review));
  return `<article>

    ${templateArticlePageHeader(reviewedArticle.article)}

    <div class="content">

      <section role="doc-abstract">
        <h2>
          Abstract
        </h2>
        ${reviewedArticle.article.abstract}
      </section>

      <section class="review-summary-list">
        <h2>
          Review summaries
        </h2>
        <ol class="review-summary-list__list">
          ${templateListItems(reviewSummaries)}
        </ol>
      </section>

    </div>

    <aside>
      <h2>
        ${reviewedArticle.reviews.length} peer reviews
      </h2>
      <ol>
        ${templateListItems(reviewSidebarItems)}
      </ol>

      <h2>
        Add a review
      </h2>

      <form method="get" action="">

        <label>
          DOI of the review
          <input type="text" name="review-doi">
        </label>

        <input type="submit" value="Add review">

      </form>
    </aside>

  </article>`;
};
