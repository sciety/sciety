import createRenderEditorialCommunities, { GetAllEditorialCommunities } from './render-editorial-communities';
import createRenderFeed, { GetActor, GetArticle, GetEvents } from './render-feed';
import createRenderFindArticle from './render-find-article';
import createRenderPageHeader from './render-page-header';

type RenderPage = () => Promise<string>;

export {
  Event, GetActor, GetArticle, GetEvents,
} from './render-feed';
export { GetAllEditorialCommunities } from './render-editorial-communities';

export default (
  editorialCommunities: GetAllEditorialCommunities,
  getActor: GetActor,
  getArticle: GetArticle,
  getEvents: GetEvents,
): RenderPage => {
  const renderPageHeader = createRenderPageHeader();
  const renderEditorialCommunities = createRenderEditorialCommunities(editorialCommunities);
  const renderFindArticle = createRenderFindArticle();
  const renderFeed = createRenderFeed(getEvents, getActor, getArticle);

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
