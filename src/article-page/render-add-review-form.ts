import Doi from '../data/doi';

export type GetAllEditorialCommunities = () => Promise<Array<{
  id: string;
  name: string;
}>>;

export type RenderAddReviewForm = (doi: Doi) => Promise<string>;

export default (
  getAllEditorialCommunities: GetAllEditorialCommunities,
): RenderAddReviewForm => (
  async (doi) => {
    const options = (await getAllEditorialCommunities()).map((ec) => (
      `<option value="${ec.id}">${ec.name}</option>`
    ));
    return `
      <h2 class="ui top attached header">
        Add a review to this article
      </h2>
      <div class="ui attached segment">
        <form method="post" action="/reviews" class="ui form">
          <input type="hidden" name="articleversiondoi" value="${doi.value}">
          <div class="field">
            <label for="editorialcommunityid">Your editorial community</label>
            <select
              name="editorialcommunityid"
              id="editorialcommunityid">
              ${options}
            </select>
          </div>
          <div class="field">
            <label for="reviewdoi">Zenodo review DOI</label>
            <input
              type="text"
              name="reviewdoi"
              id="reviewdoi"
              required>
          </div>
          <button type="submit" class="ui primary button">
            Add review
          </button>
        </form>
      </div>
      <p class="ui bottom attached warning message">
        This platform is for demonstration purposes only and data entered may not persist.
      </p>
    `;
  }
);
