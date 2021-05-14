import { callsToAction } from './calls-to-action';
import { hero } from './hero';
import { personas } from './personas';
import { recentlyEvaluated } from './recently-evaluated';
import { toHtmlFragment } from '../types/html-fragment';

const content = toHtmlFragment(`
  <div class="landing-page">
    ${hero}
    ${recentlyEvaluated}
    ${personas}
    ${callsToAction}
  </div>
`);

export const landingPage = {
  title: 'Sciety: the home of public preprint evaluation',
  content,
};
