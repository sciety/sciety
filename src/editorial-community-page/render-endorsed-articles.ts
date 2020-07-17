export type RenderEndorsedArticles = (editorialCommunityId: string) => Promise<string>;

export type GetEndorsedArticles = (editorialCommunityId: string) => Promise<Array<unknown>>;

export default (
  getEndorsedArticles: GetEndorsedArticles,
): RenderEndorsedArticles => (
  async (editorialCommunityId) => {
    const endorsedArticles = await getEndorsedArticles(editorialCommunityId);

    return `
      <section class="ui basic vertical segment">

        <h2 class="ui header">
          Endorsed articles
        </h2>

        <span data-test-id='endorsementsCount'>${endorsedArticles.length}</span>

      </section>
    `;
  }
);
