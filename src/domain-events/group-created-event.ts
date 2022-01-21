import { Group } from '../types/group';
import { GroupId } from '../types/group-id';

export type GroupCreatedEvent = Readonly<{
  type: 'GroupCreated',
  date: Date,
  groupId: GroupId,
  name: string,
  avatarPath: string,
  descriptionPath: string,
  shortDescription: string,
  homepage: string,
  slug: string,
  isAutomated: boolean,
}>;

export const groupCreated = (group: Group, date: Date = new Date()): GroupCreatedEvent => ({
  type: 'GroupCreated',
  date,
  groupId: group.id,
  name: group.name,
  avatarPath: group.avatarPath,
  descriptionPath: group.descriptionPath,
  shortDescription: group.shortDescription,
  homepage: group.homepage,
  slug: group.slug,
  isAutomated: group.isAutomated,
});
