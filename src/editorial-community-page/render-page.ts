import EditorialCommunityId from '../types/editorial-community-id';

type Component = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

type RenderPage = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export default (
  renderPageHeader: Component,
  renderDescription: Component,
  renderEndorsedArticles: Component,
  renderReviewedArticles: Component,
  renderFeed: Component,
): RenderPage => (
  async (editorialCommunityId) => (
    `
      <div class="ui aligned stackable grid">
        <div class="row">
          <div class="column">
            ${await renderPageHeader(editorialCommunityId)}
          </div>
        </div>
        <div class="row">
          <div class="eight wide column">
            ${await renderDescription(editorialCommunityId)}
          </div>
          <div class="eight wide column">
            <section class="ui two statistics">
              ${await renderEndorsedArticles(editorialCommunityId)}
              ${await renderReviewedArticles(editorialCommunityId)}
            </section>
            ${await renderFeed(editorialCommunityId)}
          </div>
        </div> 
      </div>
    `
  )
);
