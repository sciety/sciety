import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';

const renderExploreReviewedPreprintsLink = () => '<a class="home-page-hero-explore-reviewed-preprints-link" href="/search">Explore Reviewed Preprints</a>';

const renderBrowseReviewingGroupsLink = () => '<a class="home-page-hero-browse-reviewing-groups-link" href="/groups">Browse Reviewing Groups</a>';

export const renderHomepageHeroCtas = (): HtmlFragment => toHtmlFragment(`
  <div class="home-page-hero__ctas">
    ${renderExploreReviewedPreprintsLink()}
    ${renderBrowseReviewingGroupsLink()}
  </div>
`);
