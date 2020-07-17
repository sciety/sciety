export type RenderReviews = (editorialCommunityId: string) => Promise<string>;

export type GetNumberOfReviews = (editorialCommunityId: string) => Promise<number>;

export default (getNumberOfReviews: GetNumberOfReviews): RenderReviews => (
  async (editorialCommunityId) => {
    const numberOfReviews = await getNumberOfReviews(editorialCommunityId);

    return `
      <section class="ui basic vertical segment">

        <div class="ui statistic">
          <div class="value">
            <span data-test-id='reviewsCount' aria-describedby="renderReviews_label">${numberOfReviews}</span>
          </div>
          <div class="label" id="renderReviews_label">
            Reviews
          </div>
        </div>

      </section>
    `;
  }
);
