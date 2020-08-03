import EditorialCommunityId from '../types/editorial-community-id';

export type RenderEndorsedArticles = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export type GetNumberOfEndorsedArticles = (editorialCommunityId: EditorialCommunityId) => Promise<number>;

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
