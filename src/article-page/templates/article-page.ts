import addReviewForm from './add-review-form';
import templateArticlePageHeader from './article-page-header';
import templateReviewSummary from './review-summary';
import templateListItems from '../../templates/list-items';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import { ArticlePageViewModel } from '../types/article-page-view-model';

export default (
  { article, reviews }: ArticlePageViewModel,
  editorialCommunities: EditorialCommunityRepository,
): string => {
  const reviewSummaries = reviews.map((review, index) => templateReviewSummary(review, `review-${index}`));
  return `<article>

    ${templateArticlePageHeader(article)}

    <div class="content">

      <section role="doc-abstract">
        <h2>
          Abstract
        </h2>
        <div class="abstract">
          ${article.abstract}
          <a href="https://doi.org/${article.doi}" class="abstract__link">
            Read the full article
          </a>
        </div>

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
      <div class="add-review__form">
        <h2> Add a review<br/>to this article </h2>
        ${addReviewForm(article, editorialCommunities)}
      </div>
    </aside>

  </article>`;
};
