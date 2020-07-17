export type RenderEndorsedArticles = (editorialCommunityId: string) => Promise<string>;

export type GetNumberOfEndorsedArticles = (editorialCommunityId: string) => Promise<number>;

export default (
  getNumberOfEndorsedArticles: GetNumberOfEndorsedArticles,
): RenderEndorsedArticles => (
  async (editorialCommunityId) => {
    const numberOfEndorsedArticles = await getNumberOfEndorsedArticles(editorialCommunityId);

    return `
      <section class="ui basic vertical segment">

        <h2 class="ui header">
          Endorsed articles
        </h2>

        <span data-test-id='endorsementsCount'>${numberOfEndorsedArticles}</span>

      </section>
    `;
  }
);
