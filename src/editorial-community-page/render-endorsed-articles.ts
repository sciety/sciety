export type RenderEndorsedArticles = (editorialCommunityId: string) => Promise<string>;

export type GetNumberOfEndorsedArticles = (editorialCommunityId: string) => Promise<number>;

export default (
  getNumberOfEndorsedArticles: GetNumberOfEndorsedArticles,
): RenderEndorsedArticles => (
  async (editorialCommunityId) => {
    const numberOfEndorsedArticles = await getNumberOfEndorsedArticles(editorialCommunityId);

    return `
      <div class="statistic">
        <div class="value">
          <span data-test-id='endorsementsCount' aria-describedby="renderEndorsedArticles_label">${numberOfEndorsedArticles}</span>
        </div>
        <div class="label" id="renderEndorsedArticles_label">
          Endorsed articles
        </div>
      </div>
    `;
  }
);
