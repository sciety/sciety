import endorsements from '../bootstrap-endorsements';
import Doi from '../data/doi';
import templateListItems from '../templates/list-items';

type RenderEndorsedArticle = (endorsedArticle: {doi: Doi; title: string}) => Promise<string>;

const renderEndorsedArticle: RenderEndorsedArticle = async (endorsedArticle) => `
  <div class="content">
    <a href="/articles/${endorsedArticle.doi.value}" class="header">${endorsedArticle.title}</a>
  </div>
`;

type RenderEndorsedArticles = (editorialCommunityId: string) => Promise<string>;

type GetEndorsedArticles = (editorialCommunityId: string) => Promise<Array<{doi: Doi; title: string}>>;

export type GetArticleTitle = (doi: Doi) => Promise<string>;

export const createGetHardCodedEndorsedArticles = (getArticleTitle: GetArticleTitle): GetEndorsedArticles => (
  async (editorialCommunityId) => {
    const articleDois = Object.entries(endorsements).filter((entry) => entry[1]?.includes(editorialCommunityId))
      .map((entry) => new Doi(entry[0]));

    return Promise.all(articleDois.map(async (articleDoi) => (
      {
        doi: articleDoi,
        title: await getArticleTitle(articleDoi),
      }
    )));
  }
);

export default (getEndorsedArticles: GetEndorsedArticles): RenderEndorsedArticles => (
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
