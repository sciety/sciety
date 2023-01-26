import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { CreateUserAccountCommand } from '../commands/create-user-account';
import { CreateListCommand } from '../commands';
import {
  DomainEvent,
  isUserCreatedAccountEvent,
  userCreatedAccount,
} from '../../domain-events';
import { isListCreatedEvent } from '../../domain-events/list-created-event';
import { executeCreateListCommand } from '../../lists/execute-create-list-command';
import * as LOID from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';
import { UserHandle } from '../../types/user-handle';

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

const constructCommand = (userDetails: { userId: UserId, handle: UserHandle }): CreateListCommand => ({
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
    shouldCreateAccount(command.userId),
    B.fold(
      () => [],
      () => [
        userCreatedAccount(command.userId, command.handle, command.avatarUrl, command.displayName),
      ],
    ),
  ),
  ...pipe(
    events,
    shouldCreateList(command.userId),
    B.fold(
      () => [],
      () => pipe(
        constructCommand({ userId: command.userId, handle: command.handle }),
        executeCreateListCommand,
      ),
    ),
  ),
];
