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

interface ArticleAbstract {
  content: string;
}

type GetArticleAbstract = (doi: Doi) => Promise<ArticleAbstract>;

type RenderArticleAbstract = (doi: Doi) => Promise<string>;

const createRenderArticleAbstract = (getArticleAbstract: GetArticleAbstract): RenderArticleAbstract => (
  async (doi) => {
    const articleAbstract = await getArticleAbstract(doi);
    return `
      <section role="doc-abstract">
        <h2>
          Abstract
        </h2>
        <div class="abstract">
          ${articleAbstract.content}
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
  const abstractAdapter = async (): Promise<ArticleAbstract> => ({ content: article.abstract });
  const renderPageHeader = createRenderPageHeader(articleHeaderAdapter);
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
