import createRenderEditorialCommunities from './render-editorial-communities';
import createRenderFindArticle from './render-find-article';
import createMostRecentReviews, {
  FetchArticle,
  GetEditorialCommunities,
  GetReviewReferences,
} from './render-most-recent-reviews';
import createRenderPageHeader from './render-page-header';

export default (
  reviewReferences: GetReviewReferences,
  fetchArticle: FetchArticle,
  editorialCommunities: GetEditorialCommunities,
) => async (): Promise<string> => {
  const renderPageHeader = createRenderPageHeader();
  const renderMostRecentReviews = createMostRecentReviews(reviewReferences, fetchArticle, editorialCommunities);
  const renderEditorialCommunities = createRenderEditorialCommunities(editorialCommunities);
  const renderFindArticle = createRenderFindArticle();
  return `
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
  `;
};
