import { explorePageHref } from '../../../../../standards/paths';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';

const renderExploreEvaluatedPreprintsLink = () => `<a class="home-page-hero-explore-evaluated-preprints-link" href="${explorePageHref}">Explore evaluated preprints</a>`;

const renderBrowseEvaluatingGroupsLink = () => '<a class="home-page-hero-browse-evaluating-groups-link" href="/groups">Browse evaluating groups</a>';

export const renderHomepageHeroCtas = (): HtmlFragment => toHtmlFragment(`
  <div class="home-page-hero__ctas">
    ${renderExploreEvaluatedPreprintsLink()}
    ${renderBrowseEvaluatingGroupsLink()}
  </div>
`);
