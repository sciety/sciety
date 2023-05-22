import { toHtmlFragment } from '../../types/html-fragment';

export const groups = toHtmlFragment(`
<section class="home-page-groups">
  <h2>Groups evaluating preprints on Sciety</h2>
  <ul class="home-page-groups-list">
    <li><a href="/groups/biophysics-colab" class="home-page-groups-list__link"><span class="visually-hidden">Biophysics Colab</span></a></li>
  </ul>
  <a href="/groups">See all evaluating groups</a>
</section>
`);
