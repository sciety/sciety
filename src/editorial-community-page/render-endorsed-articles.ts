import renderEndorsedArticle, { EndorsedArticle } from './render-endorsed-article';

export type RenderEndorsedArticles = (editorialCommunityId: string) => Promise<string>;

export type GetEndorsedArticles = (editorialCommunityId: string) => Promise<Array<EndorsedArticle>>;

export default (
  getEndorsedArticles: GetEndorsedArticles,
): RenderEndorsedArticles => (
  async (editorialCommunityId) => {
    const endorsedArticles = await getEndorsedArticles(editorialCommunityId);

    const renderedEndorsedArticles = await Promise.all(endorsedArticles.map(renderEndorsedArticle));

    return `
      <section class="ui basic vertical segment">

        <h2 class="ui header">
          Endorsed articles
        </h2>

        <span data-test-id='endorsementsCount'>${renderedEndorsedArticles.length}</span>

      </section>
    `;
  }
);
