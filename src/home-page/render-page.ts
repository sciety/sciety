import createRenderEditorialCommunities, { GetAllEditorialCommunities } from './render-editorial-communities';
import createRenderFeed, { GetEvents, GetFollowList } from './render-feed';
import createRenderFeedItem, { GetActor, GetArticle } from './render-feed-item';
import createRenderFindArticle from './render-find-article';
import createRenderPageHeader from './render-page-header';

export type RenderPage = () => Promise<string>;

export { GetEvents, GetFollowList } from './render-feed';
export { GetActor, GetArticle } from './render-feed-item';
export { GetAllEditorialCommunities } from './render-editorial-communities';

export default (
  editorialCommunities: GetAllEditorialCommunities,
  getActor: GetActor,
  getArticle: GetArticle,
  getFollowList: GetFollowList,
  getEvents: GetEvents,
): RenderPage => {
  const renderPageHeader = createRenderPageHeader();
  const renderEditorialCommunities = createRenderEditorialCommunities(editorialCommunities);
  const renderFindArticle = createRenderFindArticle();
  const renderFeedItem = createRenderFeedItem(getActor, getArticle);
  const renderFeed = createRenderFeed(getFollowList, getEvents, renderFeedItem);

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
