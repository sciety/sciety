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

// ts-unused-exports:disable-next-line
export const listCreated = (
  listId: ListId,
  name: string,
  description: string,
  ownerId: GroupId,
): ListCreatedEvent => ({
  type: 'ListCreated',
  date: new Date(),
  listId,
  name,
  description,
  ownerId,
});
