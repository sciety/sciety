export type RenderPage = () => Promise<string>;

type Component = () => Promise<string>;

export default (
  renderPageHeader: Component,
  renderEditorialCommunities: Component,
  renderFindArticle: Component,
  renderFeed: Component,
): RenderPage => async () => `
      <div class="ui aligned stackable grid">
        <div class="row">
          <div class="column">
            ${await renderPageHeader()}
          </div>
        </div>
        <div class="row">
          <section class="ten wide column">
            ${await renderFeed()}
          </section>
          <section class="four wide right floated column">
            ${await renderFindArticle()}
            ${await renderEditorialCommunities()}
          </section>
        </div>
      </div>
    `;
