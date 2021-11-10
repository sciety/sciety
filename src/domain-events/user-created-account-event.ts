import { EventId, generate } from '../types/event-id';
import { UserId } from '../types/user-id';

export type UserCreatedAccountEvent = Readonly<{
  id: EventId,
  type: 'UserCreatedAccount',
  date: Date,
  userId: UserId,
  handle: string | undefined,
}>;

// ts-unused-exports:disable-next-line
export const userCreatedAccount = (
  userId: UserId,
  handle: string | undefined,
  date: Date = new Date(),
): UserCreatedAccountEvent => ({
  id: generate(),
  type: 'UserCreatedAccount',
  date,
  userId,
  handle,
});
