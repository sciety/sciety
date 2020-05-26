import { Context, Middleware, Next } from 'koa';

export default (
  renderPageHeader: () => Promise<string>,
  renderMostRecentReviews: (limit: number) => Promise<string>,
  renderEditorialCommunities: () => Promise<string>,
  renderFindArticle: () => Promise<string>,
): Middleware => (
  async ({ response }: Context, next: Next): Promise<void> => {
    response.body = `
      <div class="home-page">
        ${await renderPageHeader()}
        ${await renderFindArticle()}
        <div class="content-lists">
          ${await renderMostRecentReviews(5)}
          ${await renderEditorialCommunities()}
        </div>
      </div>
    `;

    await next();
  }
);
