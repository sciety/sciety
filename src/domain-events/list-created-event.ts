import { GroupId } from '../types/group-id';

type ListId = string;

export type ListCreatedEvent = Readonly<{
  type: 'ListCreated',
  date: Date,
  listId: ListId,
  name: string,
  description: string,
  ownerId: GroupId,
}>;

export const listCreated = (
  listId: ListId,
  name: string,
  description: string,
  ownerId: GroupId,
  date = new Date(),
): ListCreatedEvent => ({
  type: 'ListCreated',
  date,
  listId,
  name,
  description,
  ownerId,
});
