import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { renderGroups } from './groups';
import { hero } from './hero';

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

type ViewModel = {
  cards: HtmlFragment,
};

export const renderHomepage = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <div class="home-page">
    ${hero}
    ${renderGroups(groupLinks)}
    ${viewModel.cards}
  </div>
`);
