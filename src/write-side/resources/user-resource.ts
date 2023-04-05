import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { UserHandle } from '../../types/user-handle';
import {
  DomainEvent,
  isUserCreatedAccountEvent, isUserDetailsUpdatedEvent,
  UserCreatedAccountEvent,
  UserDetailsUpdatedEvent,
} from '../../domain-events';
import { UserId } from '../../types/user-id';
import { ErrorMessage } from '../../types/error-message';

export const exists = (userHandle: UserHandle) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isUserCreatedAccountEvent),
  RA.map((event) => event.handle),
  RA.filter((handle) => handle.toLowerCase() === userHandle.toLowerCase()),
  RA.match(
    () => false,
    () => true,
  ),
);

export type UserResource = { avatarUrl: string };

type ReplayUserResource = (userId: UserId)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, UserResource>;

const resourceFromCreationEvent = (event: UserCreatedAccountEvent) => ({ avatarUrl: event.avatarUrl });

type RelevantEvent = UserCreatedAccountEvent | UserDetailsUpdatedEvent;

const isARelevantEventForTheWriteModel = (event: DomainEvent): event is RelevantEvent => (
  isUserCreatedAccountEvent(event) || isUserDetailsUpdatedEvent(event)
);

export const replayUserResource: ReplayUserResource = (userId) => (events) => pipe(
  events,
  RA.filter(isARelevantEventForTheWriteModel),
  RA.filter((event) => event.userId === userId),
  RA.reduce(
    E.left('userId not found' as ErrorMessage),
    (resource, event) => {
      switch (event.type) {
        case 'UserCreatedAccount':
          return E.right(resourceFromCreationEvent(event));
        case 'UserDetailsUpdated':
          return pipe(
            resource,
            E.map((userResource) => pipe(
              event.avatarUrl,
              O.match(
                () => userResource,
                (updatedAvatarUrl) => ({ avatarUrl: updatedAvatarUrl }),
              ),
            )),
          );
      }
    },
  ),
);
