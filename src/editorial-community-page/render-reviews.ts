import EditorialCommunityId from '../types/editorial-community-id';

export type RenderReviews = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export type GetNumberOfReviews = (editorialCommunityId: EditorialCommunityId) => Promise<number>;

export default (getNumberOfReviews: GetNumberOfReviews): RenderReviews => (
  async (editorialCommunityId) => {
    const numberOfReviews = await getNumberOfReviews(editorialCommunityId);

    return `
      <div class="statistic">
        <div class="value">
          <span data-test-id='reviewsCount' aria-describedby="renderReviews_label">${numberOfReviews}</span>
        </div>
        <div class="label" id="renderReviews_label">
          Reviews
        </div>
      </div>
    `;
  }
);
