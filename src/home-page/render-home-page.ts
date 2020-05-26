import { Context, Middleware, Next } from 'koa';
import templateListItems from '../templates/list-items';

type RenderEditorialCommunities = () => Promise<string>;

const createRenderEditorialCommunities = (
  allCommunities: () => Promise<Array<{ id: string; name: string }>>,
): RenderEditorialCommunities => (
  async () => {
    const editorialCommunityLinks = (await allCommunities()).map((ec) => `<a href="/editorial-communities/${ec.id}">${ec.name}</a>`);
    return `
    <section>
      <h2>
        Editorial communities
      </h2>
      <ol class="u-normalised-list">
        ${templateListItems(editorialCommunityLinks)}
      </ol>
    </section>`;
  }
);

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
  editorialCommunities: () => Promise<Array<{ id: string; name: string }>>,
  renderPageHeader: () => Promise<string>,
  renderMostRecentReviews: (limit: number) => Promise<string>,
): Middleware => {
  const renderEditorialCommunities = createRenderEditorialCommunities(editorialCommunities);
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
