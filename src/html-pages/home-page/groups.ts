import { toHtmlFragment } from '../../types/html-fragment';

export const groups = toHtmlFragment(`
<section class="home-page-groups">
  <h2 class="home-page-groups__title">Groups evaluating preprints on Sciety</h2>
  <ul class="home-page-groups-list">
    <li><a href="/groups/biophysics-colab" class="home-page-groups-list__link home-page-groups-list__link--biophysics-colab"><span class="visually-hidden">Biophysics Colab</span></a></li>
    <li><a href="/groups/elife" class="home-page-groups-list__link home-page-groups-list__link--elife"><span class="visually-hidden">eLife</span></a></li>
    <li><a href="/groups/prelights" class="home-page-groups-list__link home-page-groups-list__link--prelights"><span class="visually-hidden">preLights</span></a></li>
    <li><a href="/groups/review-commons" class="home-page-groups-list__link home-page-groups-list__link--review-commons"><span class="visually-hidden">Review Commons</span></a></li>
    <li><a href="/groups/asapbio-crowd-review" class="home-page-groups-list__link home-page-groups-list__link--asapbio"><span class="visually-hidden">ASAPbio crowd review</span></a></li>
    <li><a href="/groups/rapid-reviews-covid-19" class="home-page-groups-list__link home-page-groups-list__link--rrid"><span class="visually-hidden">Rapid Reviews Infectious Diseases</span></a></li>
    <li><a href="/groups/arcadia-science" class="home-page-groups-list__link home-page-groups-list__link--arcadia-science"><span class="visually-hidden">Arcadia Science</span></a></li>
    <li><a href="/groups/prereview" class="home-page-groups-list__link home-page-groups-list__link--prereview"><span class="visually-hidden">PREreview</span></a></li>
  </ul>
  <a href="/groups">See all evaluating groups</a>
</section>
`);
