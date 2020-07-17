export type RenderReviewedArticles = (editorialCommunityId: string) => Promise<string>;

export type GetReviewedArticles = (editorialCommunityId: string) => Promise<Array<unknown>>;

export default (getReviewedArticles: GetReviewedArticles): RenderReviewedArticles => (
  async (editorialCommunityId) => {
    const reviewedArticles = await getReviewedArticles(editorialCommunityId);

    return `
      <section class="ui basic vertical segment">

        <h2 class="ui header">
          Recently reviewed articles
        </h2>

        <span data-test-id='reviewedCount'>${reviewedArticles.length}</span>

      </section>
    `;
  }
);
