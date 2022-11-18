import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { CreateListCommand } from '../commands';
import {
  DomainEvent,
  isUserCreatedAccountEvent,
  userCreatedAccount,
} from '../domain-events';
import { isListCreatedEvent } from '../domain-events/list-created-event';
import { executeCreateListCommand } from '../lists/execute-create-list-command';
import * as LOID from '../types/list-owner-id';
import { UserId } from '../types/user-id';

export type UserAccount = {
  id: UserId,
  handle: string,
  avatarUrl: string,
  displayName: string,
};

const isAccountCreatedBy = (userId: UserId) => (event: DomainEvent) => (
  isUserCreatedAccountEvent(event)
) && event.userId === userId;

const shouldCreateAccount = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter((event) => (isAccountCreatedBy(userId)(event))),
  RA.isEmpty,
);

const isListOwnedBy = (userId: UserId) => (event: DomainEvent) => (
  isListCreatedEvent(event)
) && LOID.eqListOwnerId.equals(event.ownerId, LOID.fromUserId(userId));

const shouldCreateList = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isListOwnedBy(userId)),
  RA.isEmpty,
);

const constructCommand = (userDetails: { userId: UserId, handle: string }): CreateListCommand => ({
  ownerId: LOID.fromUserId(userDetails.userId),
  name: `@${userDetails.handle}'s saved articles`,
  description: `Articles that have been saved by @${userDetails.handle}`,
});
type SetUpUserIfNecessary = (user: UserAccount) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<DomainEvent>;

export const setUpUserIfNecessary: SetUpUserIfNecessary = (user) => (events) => [
  ...pipe(
    events,
    shouldCreateAccount(user.id),
    B.fold(
      () => [],
      () => [
        userCreatedAccount(user.id, user.handle, user.avatarUrl, user.displayName),
      ],
    ),
  ),
  ...pipe(
    events,
    shouldCreateList(user.id),
    B.fold(
      () => [],
      () => pipe(
        constructCommand({ userId: user.id, handle: user.handle }),
        executeCreateListCommand,
      ),
    ),
  ),
];
