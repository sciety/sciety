import renderEndorsedArticle, { EndorsedArticle } from './render-endorsed-article';
import templateListItems from '../templates/list-items';

export type RenderEndorsedArticles = (editorialCommunityId: string) => Promise<string>;

export type GetEndorsedArticles = (editorialCommunityId: string) => Promise<Array<EndorsedArticle>>;

export default (
  getEndorsedArticles: GetEndorsedArticles,
): RenderEndorsedArticles => (
  async (editorialCommunityId) => {
    const endorsedArticles = await getEndorsedArticles(editorialCommunityId);

    if (endorsedArticles.length === 0) {
      return '';
    }

    const renderedEndorsedArticles = await Promise.all(endorsedArticles.map(renderEndorsedArticle));

    return `
      <section class="ui basic vertical segment">

        <h2 class="ui header">
          Endorsed articles
        </h2>

        <ol class="ui relaxed divided items">
          ${templateListItems(renderedEndorsedArticles)}
        </ol>

      </section>
    `;
  }
);
