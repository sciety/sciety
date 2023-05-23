import * as O from 'fp-ts/Option';
import { ViewModel } from '../render-home-page';
import { cards, Ports as CardsPorts } from '../cards';
import { GroupId } from '../../../types/group-id';

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

export type GroupsToHighlight = ReadonlyArray<{
  groupId: GroupId,
  logoPath: string,
}>;

export type Ports = CardsPorts;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const constructViewModel = (ports: Ports, groupsToHighlight: GroupsToHighlight): ViewModel => ({
  groups: O.some(groups),
  cards: cards(ports),
});
