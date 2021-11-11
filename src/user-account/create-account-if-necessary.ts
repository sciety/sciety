import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent, isUserCreatedAccountEvent, isUserFollowedEditorialCommunityEvent, RuntimeGeneratedEvent,
} from '../domain-events';
import { userCreatedAccount } from '../domain-events/user-created-account-event';
import { UserId } from '../types/user-id';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

// ts-unused-exports:disable-next-line
export type UserAccount = {
  id: UserId,
  handle: string,
  avatarUrl: string,
  displayName: string,
};

type CreateAccountIfNecessary = (ports: Ports) => (userAccount: UserAccount) => T.Task<void>;

const isInterestingEvent = (userId: UserId) => (event: DomainEvent) => (
  isUserFollowedEditorialCommunityEvent(event) || isUserCreatedAccountEvent(event)
) && event.userId === userId;

export const createAccountIfNecessary: CreateAccountIfNecessary = ({
  getAllEvents,
  commitEvents,
}) => (
  user,
) => pipe(
  getAllEvents,
  T.map(RA.filter(isInterestingEvent(user.id))),
  T.map(RA.isNonEmpty),
  T.map((hasAlreadyLoggedInBefore) => (
    hasAlreadyLoggedInBefore
      ? []
      : [userCreatedAccount(user.id, user.handle, user.avatarUrl, user.displayName)])),
  T.chain(commitEvents),
);
