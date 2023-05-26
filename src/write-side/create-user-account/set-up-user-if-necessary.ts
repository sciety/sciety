import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { v4 } from 'uuid';
import * as LID from '../../types/list-id';
import { CreateUserAccountCommand } from '../commands/create-user-account';
import {
  DomainEvent,
  isEventOfType,
  listCreated,
  userCreatedAccount,
} from '../../domain-events';
import * as LOID from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';

const isAccountCreatedBy = (userId: UserId) => (event: DomainEvent) => (
  isEventOfType('UserCreatedAccount')(event)
) && event.userId === userId;

const shouldCreateAccount = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter((event) => (isAccountCreatedBy(userId)(event))),
  RA.isEmpty,
);

const isListOwnedBy = (userId: UserId) => (event: DomainEvent) => (
  isEventOfType('ListCreated')(event)
) && LOID.eqListOwnerId.equals(event.ownerId, LOID.fromUserId(userId));

const shouldCreateList = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isListOwnedBy(userId)),
  RA.isEmpty,
);

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
      () => [
        listCreated(
          LID.fromValidatedString(v4()),
          `@${command.handle}'s saved articles`,
          `Articles that have been saved by @${command.handle}`,
          LOID.fromUserId(command.userId),
        ),
      ],
    ),
  ),
];
