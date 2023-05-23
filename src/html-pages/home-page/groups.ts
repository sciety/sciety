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
    <li><a href="/groups/elife" class="home-page-groups-list__link home-page-groups-list__link--elife"><span class="visually-hidden">eLife</span></a></li>
    <li><a href="/groups/prelights" class="home-page-groups-list__link home-page-groups-list__link--prelights"><span class="visually-hidden">preLights</span></a></li>
    <li><a href="/groups/review-commons" class="home-page-groups-list__link home-page-groups-list__link--review-commons"><span class="visually-hidden">Review Commons</span></a></li>
    <li><a href="/groups/asapbio-crowd-review" class="home-page-groups-list__link home-page-groups-list__link--asapbio"><span class="visually-hidden">ASAPbio crowd review</span></a></li>
    <li><a href="/groups/rapid-reviews-covid-19" class="home-page-groups-list__link home-page-groups-list__link--rrid"><span class="visually-hidden">Rapid Reviews Infectious Diseases</span></a></li>
    <li><a href="/groups/arcadia-science" class="home-page-groups-list__link home-page-groups-list__link--arcadia-science"><span class="visually-hidden">Arcadia Science</span></a></li>
    <li><a href="/groups/prereview" class="home-page-groups-list__link home-page-groups-list__link--prereview"><span class="visually-hidden">PREreview</span></a></li>
  </ul>
  <div class="home-page-groups__button_wrapper">
    <a href="/groups" class="home-page-groups__button">See all evaluating groups</a>
  </div>
</section>
`,
  toHtmlFragment,
);
