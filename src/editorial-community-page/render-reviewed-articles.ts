import templateListItems from '../templates/list-items';
import Doi from '../types/doi';

interface ReviewedArticle {
  doi: Doi;
  title: string;
}

const templateTeaser = (article: ReviewedArticle): string => (`
  <div class="content">
    <a href="/articles/${article.doi}" class="header">${article.title}</a>
  </div>
`);

export type RenderReviewedArticles = (editorialCommunityId: string) => Promise<string>;

export type GetReviewedArticles = (editorialCommunityId: string) => Promise<Array<ReviewedArticle>>;

export default (getReviewedArticles: GetReviewedArticles): RenderReviewedArticles => (
  async (editorialCommunityId) => {
    const reviewedArticles = await getReviewedArticles(editorialCommunityId);

    return `
      <section class="ui basic vertical segment">

        <h2 class="ui header">
          Recently reviewed articles
        </h2>

        <ol class="ui relaxed divided items">
          ${templateListItems(reviewedArticles.map(templateTeaser))}
        </ol>

      </section>
    `;
  }
);
