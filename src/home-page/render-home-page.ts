import { Context, Middleware, Next } from 'koa';

type RenderFindArticle = () => Promise<string>;

const createRenderFindArticle = (): RenderFindArticle => (
  async () => (`
    <form method="get" action="/articles" class="find-reviews compact-form">
    <fieldset>

      <legend class="compact-form__title">
        Find an article
      </legend>

      <div class="compact-form__row">

        <label>
          <span class="visually-hidden">Search for an article by bioRxiv DOI</span>
          <input
            type="text"
            name="doi"
            placeholder="Search for an article by bioRxiv DOI"
            class="compact-form__article-doi"
            required>
        </label>

        <button type="submit" class="compact-form__submit">
          <span class="visually-hidden">Find an article</span>
        </button>

      </div>

    </fieldset>
    </form>
  `)
);

export default (
  renderPageHeader: () => Promise<string>,
  renderMostRecentReviews: (limit: number) => Promise<string>,
  renderEditorialCommunities: () => Promise<string>,
): Middleware => {
  const renderFindArticle = createRenderFindArticle();
  return async ({ response }: Context, next: Next): Promise<void> => {
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
  };
};
