import { pipe } from 'fp-ts/function';
import { Page } from '../../types/page';
import { renderHomepage } from './render-as-html/render-home-page';
import { constructViewModel, GroupsToHighlight, Ports } from './construct-view-model/construct-view-model';
import * as GID from '../../types/group-id';

const groupsToHighlight: GroupsToHighlight = [
  {
    groupId: GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2'),
    logoPath: '/static/images/home-page/biophysics-colab.png',
  },
  {
    groupId: GID.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    logoPath: '/static/images/home-page/elife.svg',
  },
  {
    groupId: GID.fromValidatedString('f97bd177-5cb6-4296-8573-078318755bf2'),
    logoPath: '/static/images/home-page/prelights.svg',
  },
  {
    groupId: GID.fromValidatedString('316db7d9-88cc-4c26-b386-f067e0f56334'),
    logoPath: '/static/images/home-page/review-commons.png',
  },
  {
    groupId: GID.fromValidatedString('50401e46-b764-47b7-8557-6bb35444b7c8'),
    logoPath: '/static/images/home-page/asapbio.png',
  },
  {
    groupId: GID.fromValidatedString('5142a5bc-6b18-42b1-9a8d-7342d7d17e94'),
    logoPath: '/static/images/home-page/rrid.png',
  },
  {
    groupId: GID.fromValidatedString('bc1f956b-12e8-4f5c-aadc-70f91347bd18'),
    logoPath: '/static/images/home-page/arcadia-science.svg',
  },
  {
    groupId: GID.fromValidatedString('10360d97-bf52-4aef-b2fa-2f60d319edd7'),
    logoPath: '/static/images/home-page/prereview.svg',
  },
];

export const homePage = (ports: Ports): Page => pipe(
  constructViewModel(ports, groupsToHighlight),
  renderHomepage,
  (content) => ({
    title: 'Sciety: the home of public preprint evaluation',
    content,
  }),
);
