import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { CreateUserAccountCommand } from '../write-side/commands/create-user-account';
import { CreateListCommand } from '../write-side/commands';
import {
  DomainEvent,
  isUserCreatedAccountEvent,
  userCreatedAccount,
} from '../domain-events';
import { isListCreatedEvent } from '../domain-events/list-created-event';
import { executeCreateListCommand } from '../lists/execute-create-list-command';
import * as LOID from '../types/list-owner-id';
import { UserId } from '../types/user-id';

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
type SetUpUserIfNecessary = (command: CreateUserAccountCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> ReadonlyArray<DomainEvent>;

export const setUpUserIfNecessary: SetUpUserIfNecessary = (command) => (events) => [
  ...pipe(
    events,
    shouldCreateAccount(command.id),
    B.fold(
      () => [],
      () => [
        userCreatedAccount(command.id, command.handle, command.avatarUrl, command.displayName),
      ],
    ),
  ),
  ...pipe(
    events,
    shouldCreateList(command.id),
    B.fold(
      () => [],
      () => pipe(
        constructCommand({ userId: command.id, handle: command.handle }),
        executeCreateListCommand,
      ),
    ),
  ),
];
