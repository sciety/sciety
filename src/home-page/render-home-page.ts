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
        <div class="ui aligned stackable grid container">
          <div class="row">
            <section class="eight wide column">
              ${await renderMostRecentReviews(5)}
            </section>
            <section class="six wide right floated column">
              ${await renderEditorialCommunities()}
             </section>
          </div>
        </div>
      </div>
    `;

    await next();
  }
);
