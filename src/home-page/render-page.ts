import createRenderEditorialCommunities from './render-editorial-communities';
import createRenderFeed from './render-feed';
import createRenderFindArticle from './render-find-article';
import createRenderPageHeader from './render-page-header';
import createRenderRecentActivity, {
  FetchArticle,
  GetEditorialCommunities,
  GetReviewReferences,
} from './render-recent-activity';

type RenderPage = () => Promise<string>;

export { FetchArticle } from './render-recent-activity';

export default (
  reviewReferences: GetReviewReferences,
  fetchArticle: FetchArticle,
  editorialCommunities: GetEditorialCommunities,
): RenderPage => {
  const renderPageHeader = createRenderPageHeader();
  const renderRecentActivity = createRenderRecentActivity(reviewReferences, fetchArticle, editorialCommunities);
  const renderEditorialCommunities = createRenderEditorialCommunities(editorialCommunities);
  const renderFindArticle = createRenderFindArticle();
  const renderFeed = createRenderFeed();

  return async () => `
      <div class="ui aligned stackable grid">
        <div class="row">
          <div class="column">
            ${await renderPageHeader()}
          </div>
        </div>
        <div class="row">
          <div class="column">
            ${await renderFindArticle()}
          </div>
        </div>
        <div class="row">
          <section class="eight wide column">
            ${await renderRecentActivity(5)}
          </section>
          <section class="six wide right floated column">
            ${await renderEditorialCommunities()}
           </section>
        </div>
        <div class="row">
          <div class="column">
            ${await renderFeed()}
          </div>
        </div>
      </div>
    `;
};
