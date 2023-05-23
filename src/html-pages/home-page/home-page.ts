import { pipe } from 'fp-ts/function';
import { cards, Ports as CardsPorts } from './cards';
import { Page } from '../../types/page';
import { renderHomepage } from './render-home-page';

const groups = [
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

type Ports = CardsPorts;

export const homePage = (ports: Ports): Page => pipe(
  {
    groups,
    cards: cards(ports),
  },
  renderHomepage,
  (content) => ({
    title: 'Sciety: the home of public preprint evaluation',
    content,
  }),
);
