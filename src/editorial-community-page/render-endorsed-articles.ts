import templateListItems from '../templates/list-items';
import Doi from '../types/doi';

type RenderEndorsedArticle = (endorsedArticle: {doi: Doi; title: string}) => Promise<string>;

const renderEndorsedArticle: RenderEndorsedArticle = async (endorsedArticle) => `
  <div class="content">
    <a href="/articles/${endorsedArticle.doi.value}" class="header">${endorsedArticle.title}</a>
  </div>
`;

export type RenderEndorsedArticles = (editorialCommunityId: string) => Promise<string>;

export type GetEndorsedArticles = (editorialCommunityId: string) => Promise<Array<{doi: Doi; title: string}>>;

export type GetArticleTitle = (doi: Doi) => Promise<string>;

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
