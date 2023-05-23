import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { toHtmlFragment } from '../../types/html-fragment';
import { templateListItems } from '../../shared-components/list-items';

type GroupLinkViewModel = {
  link: string,
  logoPath: string,
  name: string,
};

const groupLinks = [
  {
    link: '/groups/biophysics-colab',
    logoPath: '/static/images/home-page/biophysics-collab.png',
    name: 'Biophysics Colab',
  },
  {
    link: '/groups/elife',
    logoPath: '/static/images/home-page/elife.svg',
    name: 'eLife',
  },
  {
    link: '/groups/prelights',
    logoPath: '/static/images/home-page/prelights.svg',
    name: 'preLights',
  },
  {
    link: '/groups/review-commons',
    logoPath: '/static/images/home-page/review-commons.png',
    name: 'Review Commons',
  },
  {
    link: '/groups/asapbio-crowd-review',
    logoPath: '/static/images/home-page/asapbio.png',
    name: 'ASAPbio crowd review',
  },
  {
    link: '/groups/rapid-reviews-covid-19',
    logoPath: '/static/images/home-page/rrid.png',
    name: 'Rapid Reviews Infectious Diseases',
  },
  {
    link: '/groups/arcadia-science',
    logoPath: '/static/images/home-page/arcadia-science.svg',
    name: 'Arcadia Science',
  },
  {
    link: '/groups/prereview',
    logoPath: '/static/images/home-page/prereview.svg',
    name: 'PREreview',
  },
];

const renderGroup = (groupLink: GroupLinkViewModel) => `<a href="${groupLink.link}" class="home-page-groups-list__link" style="background-image: url('${groupLink.logoPath}');"><span class="visually-hidden">${groupLink.name}</span></a>`;

export const groups = pipe(
  groupLinks,
  RA.map(renderGroup),
  RA.map(toHtmlFragment),
  templateListItems,
  (listContent) => `
<section class="home-page-groups">
  <h2 class="home-page-groups__title">Groups evaluating preprints on Sciety</h2>
  <ul class="home-page-groups-list">
  ${listContent}
  </ul>
  <div class="home-page-groups__button_wrapper">
    <a href="/groups" class="home-page-groups__button">See all evaluating groups</a>
  </div>
</section>
`,
  toHtmlFragment,
);
