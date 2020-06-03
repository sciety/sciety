import addReviewForm from './add-review-form';
import templateArticlePageHeader from './article-page-header';
import templateReviewSummary from './review-summary';
import Doi from '../../data/doi';
import templateListItems from '../../templates/list-items';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import createRenderArticleAbstract, { GetArticleAbstract } from '../render-article-abstract';
import { ArticlePageViewModel } from '../types/article-page-view-model';

interface ArticleDetails {
  title: string;
  authors: Array<string>;
  doi: Doi;
  publicationDate: Date;
}

type RenderPageHeader = (doi: Doi) => Promise<string>;

type GetArticleDetails = (doi: Doi) => Promise<ArticleDetails>;

const createRenderPageHeader = (getArticleDetails: GetArticleDetails): RenderPageHeader => (
  async (doi) => templateArticlePageHeader(await getArticleDetails(doi))
);

export default async (
  { article, reviews }: ArticlePageViewModel,
  editorialCommunities: EditorialCommunityRepository,
): Promise<string> => {
  const reviewSummaries = reviews.map((review, index) => templateReviewSummary(review, `review-${index}`));
  const getArticleDetailsAdapter = async (): Promise<ArticleDetails> => article;
  const abstractAdapter: GetArticleAbstract = async () => ({ content: article.abstract });
  const renderPageHeader = createRenderPageHeader(getArticleDetailsAdapter);
  const renderArticleAbstract = createRenderArticleAbstract(abstractAdapter);
  return `<article>

    ${await renderPageHeader(article.doi)}

    <div class="content">

      ${await renderArticleAbstract(article.doi)}

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
