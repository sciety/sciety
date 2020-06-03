import addReviewForm from './add-review-form';
import templateArticlePageHeader from './article-page-header';
import templateReviewSummary from './review-summary';
import Doi from '../../data/doi';
import templateListItems from '../../templates/list-items';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import { ArticlePageViewModel } from '../types/article-page-view-model';

interface ArticleHeader {
  title: string;
  authors: Array<string>;
  doi: Doi;
  publicationDate: Date;
}

type RenderPageHeader = (doi: Doi) => Promise<string>;

const createRenderPageHeader = (header: (doi: Doi) => Promise<ArticleHeader>): RenderPageHeader => (
  async (doi) => templateArticlePageHeader(await header(doi))
);

interface Abstract {
  abstract: string;
}

type RenderAbstract = (doi: Doi) => Promise<string>;

const createRenderAbstract = (fetchAbstract: (doi: Doi) => Promise<Abstract>): RenderAbstract => (
  async (doi) => {
    const abstract = await fetchAbstract(doi);
    return `
      <section role="doc-abstract">
        <h2>
          Abstract
        </h2>
        <div class="abstract">
          ${abstract.abstract}
          <a href="https://doi.org/${doi}" class="abstract__link">
            Read the full article
          </a>
        </div>
      </section>
    `;
  }
);

export default async (
  { article, reviews }: ArticlePageViewModel,
  editorialCommunities: EditorialCommunityRepository,
): Promise<string> => {
  const reviewSummaries = reviews.map((review, index) => templateReviewSummary(review, `review-${index}`));
  const articleHeaderAdapter = async (): Promise<ArticleHeader> => article;
  const abstractAdapter = async (): Promise<Abstract> => article;
  const renderPageHeader = createRenderPageHeader(articleHeaderAdapter);
  const renderAbstract = createRenderAbstract(abstractAdapter);
  return `<article>

    ${await renderPageHeader(article.doi)}

    <div class="content">

      ${await renderAbstract(article.doi)}

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
