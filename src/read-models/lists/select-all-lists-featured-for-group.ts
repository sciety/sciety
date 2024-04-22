import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';
import * as GID from '../../types/group-id';
import * as LID from '../../types/list-id';

const hardcoded = new Map<GroupId, ReadonlyArray<LID.ListId>>([
  [GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2'), [
    LID.fromValidatedString('454ba80f-e0bc-47ed-ba76-c8f872c303d2'),
    LID.fromValidatedString('5ac3a439-e5c6-4b15-b109-92928a740812'),
  ]],
  [GID.fromValidatedString('f7a7aec3-8b1c-4b81-b098-f3f2e4eefe58'), [LID.fromValidatedString('729cab51-b47d-4ab5-bf2f-8282f1de445e')]],
]);

export const selectAllListsFeaturedForGroup = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readModel: ReadModel,
) => (
  groupId: GroupId,
): ReadonlyArray<LID.ListId> => {
  const featuredListIds = hardcoded.get(groupId);
  if (featuredListIds === undefined) {
    return [];
  }
  return featuredListIds;
};
