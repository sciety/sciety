import { toHtmlFragment } from '../../types/html-fragment';

export const groups = process.env.EXPERIMENT_ENABLED === 'true'
  ? toHtmlFragment(`
<section class="home-page-groups">
  <h2>Groups evaluating preprints on Sciety</h2>
  <ul>
    <li><a href="/groups/biophysics-colab">Biophysics Colab</a></li>
  </ul>
  <a href="/groups">See all evaluating groups</a>
</section>
`)
  : toHtmlFragment('');
