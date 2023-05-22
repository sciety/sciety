import { toHtmlFragment } from '../../types/html-fragment';

export const groups = toHtmlFragment(`
<section class="home-page-groups">
  <h2>Groups evaluating preprints on Sciety</h2>
  <ul class="home-page-groups-list">
    <li><a href="/groups/biophysics-colab" class="home-page-groups-list__link home-page-groups-list__link--biophysics-colab"><span class="visually-hidden">Biophysics Colab</span></a></li>
    <li><a href="/groups/elife" class="home-page-groups-list__link home-page-groups-list__link--elife"><span class="visually-hidden">eLife</span></a></li>
  </ul>
  <a href="/groups">See all evaluating groups</a>
</section>
`);
