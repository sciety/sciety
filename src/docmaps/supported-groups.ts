import * as GID from '../types/group-id';

const arcadiaScienceGroupId = GID.fromValidatedString('bc1f956b-12e8-4f5c-aadc-70f91347bd18');
const asapBioGroupId = GID.fromValidatedString('50401e46-b764-47b7-8557-6bb35444b7c8');
const biophysicsColabGroupId = GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2');
const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
const peerJGroupId = GID.fromValidatedString('53ed5364-a016-11ea-bb37-0242ac130002');
const preLightsGroupId = GID.fromValidatedString('f97bd177-5cb6-4296-8573-078318755bf2');
const preReviewGroupId = GID.fromValidatedString('10360d97-bf52-4aef-b2fa-2f60d319edd7');
const rapidReviewsGroupId = GID.fromValidatedString('5142a5bc-6b18-42b1-9a8d-7342d7d17e94');

export const supportedGroups = [
  arcadiaScienceGroupId,
  asapBioGroupId,
  biophysicsColabGroupId,
  ncrcGroupId,
  peerJGroupId,
  preLightsGroupId,
  preReviewGroupId,
  rapidReviewsGroupId,
];
