import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import {
  DomainEvent,
  isUserCreatedAccountEvent, isUserDetailsUpdatedEvent,
  UserCreatedAccountEvent,
  UserDetailsUpdatedEvent,
} from '../../../domain-events';
import { UserId } from '../../../types/user-id';
import { ErrorMessage } from '../../../types/error-message';

type RelevantEvent = UserCreatedAccountEvent | UserDetailsUpdatedEvent;

const isARelevantEventForTheWriteModel = (event: DomainEvent): event is RelevantEvent => (
  isUserCreatedAccountEvent(event) || isUserDetailsUpdatedEvent(event)
);

export type UserResource = {
  avatarUrl: string,
  displayName: string,
};

const resourceFromCreationEvent = (event: UserCreatedAccountEvent) => ({
  avatarUrl: event.avatarUrl,
  displayName: event.displayName,
});

type ReplayUserResource = (userId: UserId)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, UserResource>;

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
            E.map((userResource) => ({
              ...userResource,
              avatarUrl: event.avatarUrl ?? userResource.avatarUrl,
              displayName: event.displayName ?? userResource.displayName,
            })),
          );
      }
    },
  ),
);
