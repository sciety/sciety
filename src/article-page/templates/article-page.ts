import addReviewForm from './add-review-form';
import templateReviewSummary from './review-summary';
import Doi from '../../data/doi';
import templateListItems from '../../templates/list-items';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import createRenderArticleAbstract, { GetArticleAbstract } from '../render-article-abstract';
import createRenderPageHeader, { GetArticleDetails } from '../render-page-header';
import { ArticlePageViewModel } from '../types/article-page-view-model';

interface ReviewSummary {
  publicationDate: Date;
  summary: string;
  doi: Doi;
  editorialCommunityId: string;
  editorialCommunityName: string;
}

export type GetArticleReviewSummaries = () => Promise<Array<ReviewSummary>>;

const createRenderReviewSummaries = (reviews: GetArticleReviewSummaries) => async (): Promise<string> => {
  const reviewSummaries = (await reviews()).map((review, index) => templateReviewSummary(review, `review-${index}`));
  return `
    <h2 class="ui header">
      Review summaries
    </h2>
    <ol class="review-summary-list__list">
      ${templateListItems(reviewSummaries)}
    </ol>
  `;
};

export default async (
  { article, reviews }: ArticlePageViewModel,
  editorialCommunities: EditorialCommunityRepository,
): Promise<string> => {
  const getArticleDetailsAdapter: GetArticleDetails = async () => article;
  const abstractAdapter: GetArticleAbstract = async () => ({ content: article.abstract });
  const reviewsAdapter: GetArticleReviewSummaries = async () => reviews;
  const renderPageHeader = createRenderPageHeader(getArticleDetailsAdapter);
  const renderArticleAbstract = createRenderArticleAbstract(abstractAdapter);
  const renderReviewSummaries = createRenderReviewSummaries(reviewsAdapter);
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
        ${await renderReviewSummaries()}
      </section>
    </div>
    <aside>
      ${renderAddReviewForm()}
    </aside>
  </article>`;
};
