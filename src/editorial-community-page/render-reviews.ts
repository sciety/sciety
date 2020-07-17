export type RenderReviews = (editorialCommunityId: string) => Promise<string>;

export type GetNumberOfReviews = (editorialCommunityId: string) => Promise<number>;

export default (getNumberOfReviews: GetNumberOfReviews): RenderReviews => (
  async (editorialCommunityId) => {
    const numberOfReviews = await getNumberOfReviews(editorialCommunityId);

    return `
      <section class="ui basic vertical segment">

        <h2 class="ui header">
          Reviews
        </h2>

        <span data-test-id='reviewsCount'>${numberOfReviews}</span>

      </section>
    `;
  }
);
