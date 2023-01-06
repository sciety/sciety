/* eslint-disable no-param-reassign */
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isUserCreatedAccountEvent, isUserFollowedEditorialCommunityEvent } from '../domain-events';
import {
  Logger,
} from '../infrastructure';
import { GetUserDetailsBatch } from '../third-parties/twitter';
import { UserId } from '../types/user-id';
import { createAccountIfNecessary, Ports as CreateAccountIfNecessaryPorts } from '../user-account/create-account-if-necessary';

type ReadModel = Record<UserId, boolean>;

// ts-unused-exports:disable-next-line
export const updateSetOfUsersWithoutCreatedAccountEvents = (state: ReadModel, event: DomainEvent) => {
  if (isUserCreatedAccountEvent(event)) {
    state[event.userId] = true;
  }
  if (isUserFollowedEditorialCommunityEvent(event)) {
    state[event.userId] = false;
  }
  return state;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectUserIdsWithoutAccount = (readModel: ReadModel): ReadonlyArray<UserId> => [];

type EnsureAllUsersHaveCreatedAccountEvents = (
  events: ReadonlyArray<DomainEvent>,
  ports: {
    getUserDetailsBatch: GetUserDetailsBatch,
    logger: Logger,
  } & CreateAccountIfNecessaryPorts
) => T.Task<void>;

export const ensureAllUsersHaveCreatedAccountEvents: EnsureAllUsersHaveCreatedAccountEvents = (events, ports) => pipe(
  events,
  RA.reduce({}, updateSetOfUsersWithoutCreatedAccountEvents),
  selectUserIdsWithoutAccount,
  (userIds) => {
    ports.logger('debug', 'ensureAllUsersHaveCreatedAccountEvents', { countOfUserIds: userIds.length });
    return userIds;
  },
  ports.getUserDetailsBatch,
  TE.map(RA.map((userDetails) => ({ ...userDetails, id: userDetails.userId }))),
  TE.chainTaskK(T.traverseArray(createAccountIfNecessary(ports))),
  TE.getOrElseW((dataError) => T.of(ports.logger('debug', 'ensureAllUserHaveCreatedAccountEvents', { dataError }))),
  () => T.of(undefined),
);
