import addReviewForm from './add-review-form';
import templateReviewSummary from './review-summary';
import templateListItems from '../../templates/list-items';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import createRenderArticleAbstract, { GetArticleAbstract } from '../render-article-abstract';
import createRenderPageHeader, { GetArticleDetails } from '../render-page-header';
import { ArticlePageViewModel } from '../types/article-page-view-model';

export default async (
  { article, reviews }: ArticlePageViewModel,
  editorialCommunities: EditorialCommunityRepository,
): Promise<string> => {
  const getArticleDetailsAdapter: GetArticleDetails = async () => article;
  const abstractAdapter: GetArticleAbstract = async () => ({ content: article.abstract });
  const renderPageHeader = createRenderPageHeader(getArticleDetailsAdapter);
  const renderArticleAbstract = createRenderArticleAbstract(abstractAdapter);
  const renderReviewSummaries = (): string => {
    const reviewSummaries = reviews.map((review, index) => templateReviewSummary(review, `review-${index}`));
    return `
      <h2 class="ui header">
        Review summaries
      </h2>
      <ol class="review-summary-list__list">
        ${templateListItems(reviewSummaries)}
      </ol>
    `;
  };
  const renderAddReviewForm = (): string => `
    <div class="add-review__form">
      <h2 class="ui header"> Add a review<br/>to this article </h2>
      ${addReviewForm(article, editorialCommunities)}
    </div>
  `;
  return `<article>
    ${await renderPageHeader(article.doi)}
    <div class="content">
      ${await renderArticleAbstract(article.doi)}
      <section class="review-summary-list">
        ${renderReviewSummaries()}
      </section>
    </div>
    <aside>
      ${renderAddReviewForm()}
    </aside>
  </article>`;
};
