import addReviewForm from './add-review-form';
import Doi from '../../data/doi';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import createRenderArticleAbstract, { GetArticleAbstract } from '../render-article-abstract';
import createRenderPageHeader, { GetArticleDetails } from '../render-page-header';
import createRenderReviewSummaries, { GetArticleReviewSummaries } from '../render-review-summaries';
import { ArticlePageViewModel } from '../types/article-page-view-model';

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
  const renderAddReviewForm = (doi: Doi): string => `
    <h2 class="ui top attached header">
      Add a review to this article
    </h2>
    <div class="ui bottom attached segment">
      ${addReviewForm(doi, editorialCommunities)}
    </div>
  `;
  return `<article class="ui aligned stackable grid container">
    ${await renderPageHeader(article.doi)}
    <div class="row">
      <section class="twelve wide column">
        ${await renderArticleAbstract(article.doi)}
        <section class="review-summary-list">
          ${await renderReviewSummaries()}
        </section>
      </section>
      <aside class="four wide right floated column">
        ${renderAddReviewForm(article.doi)}
      </aside>
    </div>
  </article>`;
};
