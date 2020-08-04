import createRenderEditorialCommunities, { GetAllEditorialCommunities } from './render-editorial-communities';
import createRenderFeed, { GetActor, GetArticle } from './render-feed';
import createRenderFindArticle from './render-find-article';
import createRenderPageHeader from './render-page-header';

type RenderPage = () => Promise<string>;

export { GetActor, GetArticle } from './render-feed';
export { GetAllEditorialCommunities } from './render-editorial-communities';

export default (
  editorialCommunities: GetAllEditorialCommunities,
  getActor: GetActor,
  getArticle: GetArticle,
): RenderPage => {
  const renderPageHeader = createRenderPageHeader();
  const renderEditorialCommunities = createRenderEditorialCommunities(editorialCommunities);
  const renderFindArticle = createRenderFindArticle();
  const renderFeed = createRenderFeed(getActor, getArticle);

  return async () => `
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
};
