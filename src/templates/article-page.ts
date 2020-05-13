import templateArticlePageHeader from './article-page-header';
import templateListItems from './list-items';
import templateReviewSidebarItem from './review-sidebar-item';
import templateReviewSummary from './review-summary';
import addReviewForm from '../article-page/add-review-form';
import Doi from '../data/doi';
import EditorialCommunityRepository from '../types/editorial-community-repository';

interface Article {
  title: string;
  doi: Doi;
  publicationDate: Date;
  abstract: string;
  authors: Array<string>;
}

interface Review {
  publicationDate: Date;
  summary: string;
  doi: Doi;
  editorialCommunityId: string;
  editorialCommunityName: string;
}

export interface ArticlePage {
  article: Article;
  reviews: Array<Review>;
}

export default ({ article, reviews }: ArticlePage, editorialCommunities: EditorialCommunityRepository): string => {
  const reviewSummaries = reviews.map((review, index) => templateReviewSummary(review, `review-${index}`));
  const reviewSidebarItems = reviews.map((review) => templateReviewSidebarItem(review));
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
          ${templateListItems(reviewSummaries)}
        </ol>
      </section>

    </div>

    <aside>
      <h2>
        ${reviews.length} peer reviews
      </h2>
      <ol>
        ${templateListItems(reviewSidebarItems)}
      </ol>

      <h2> Add a review </h2>
      ${addReviewForm(article, editorialCommunities)}

    </aside>

  </article>`;
};
