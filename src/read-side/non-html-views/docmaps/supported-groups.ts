import * as GID from '../../../types/group-id';

const arcadiaScienceGroupId = GID.fromValidatedString('bc1f956b-12e8-4f5c-aadc-70f91347bd18');
const asapBioGroupId = GID.fromValidatedString('50401e46-b764-47b7-8557-6bb35444b7c8');
const biophysicsColabGroupId = GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2');
const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
const peerJGroupId = GID.fromValidatedString('53ed5364-a016-11ea-bb37-0242ac130002');
const preLightsGroupId = GID.fromValidatedString('f97bd177-5cb6-4296-8573-078318755bf2');
const preReviewGroupId = GID.fromValidatedString('10360d97-bf52-4aef-b2fa-2f60d319edd7');
const rapidReviewsGroupId = GID.fromValidatedString('5142a5bc-6b18-42b1-9a8d-7342d7d17e94');
const elifeGroupId = GID.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');
const lifeScienceEditorsGroupId = GID.fromValidatedString('1480d2dd-463f-4834-8e81-d89c8ae2b86f');
const lifeScienceEditorsFoundationGroupId = GID.fromValidatedString('f2c9eafa-6e24-4549-819c-09179e642b08');
const accessMicrobiologyGroupId = GID.fromValidatedString('4d6a8908-22a9-45c8-bd56-3c7140647709');

const supportedGroups = [
  arcadiaScienceGroupId,
  asapBioGroupId,
  biophysicsColabGroupId,
  ncrcGroupId,
  peerJGroupId,
  preLightsGroupId,
  preReviewGroupId,
  rapidReviewsGroupId,
  lifeScienceEditorsGroupId,
  lifeScienceEditorsFoundationGroupId,
];
if (process.env.EXPERIMENT_ENABLED === 'true') {
  supportedGroups.push(elifeGroupId);
  supportedGroups.push(accessMicrobiologyGroupId);
}

export { supportedGroups };
