import { pipe } from 'fp-ts/function';
import { constructViewModel, GroupsToHighlight } from './construct-view-model/construct-view-model';
import { Dependencies } from './dependencies';
import { renderAsHtml } from './render-as-html/render-as-html';
import { HtmlPage } from '../../../html-pages/html-page';
import * as GID from '../../../types/group-id';

const groupsToHighlight: GroupsToHighlight = [
  {
    groupId: GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2'),
  },
  {
    groupId: GID.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
  },
  {
    groupId: GID.fromValidatedString('f97bd177-5cb6-4296-8573-078318755bf2'),
  },
  {
    groupId: GID.fromValidatedString('316db7d9-88cc-4c26-b386-f067e0f56334'),
  },
  {
    groupId: GID.fromValidatedString('50401e46-b764-47b7-8557-6bb35444b7c8'),
  },
  {
    groupId: GID.fromValidatedString('5142a5bc-6b18-42b1-9a8d-7342d7d17e94'),
  },
  {
    groupId: GID.fromValidatedString('bc1f956b-12e8-4f5c-aadc-70f91347bd18'),
  },
  {
    groupId: GID.fromValidatedString('f7a7aec3-8b1c-4b81-b098-f3f2e4eefe58'),
  },
];

export const homePage = (dependencies: Dependencies): HtmlPage => pipe(
  constructViewModel(dependencies, groupsToHighlight),
  renderAsHtml,
);
