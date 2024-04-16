import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent,
  EventOfType,
  isEventOfType,
} from '../../../domain-events';
import { ErrorMessage, toErrorMessage } from '../../../types/error-message';
import { UserId } from '../../../types/user-id';

type RelevantEvent = EventOfType<'UserCreatedAccount'> | EventOfType<'UserDetailsUpdated'>;

const isARelevantEventForTheWriteModel = (event: DomainEvent): event is RelevantEvent => (
  isEventOfType('UserCreatedAccount')(event) || isEventOfType('UserDetailsUpdated')(event)
);

export type UserResource = {
  avatarUrl: string,
  displayName: string,
};

const resourceFromCreationEvent = (event: EventOfType<'UserCreatedAccount'>) => ({
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
    E.left(toErrorMessage('userId not found')),
    (resource, event) => {
      if (isEventOfType('UserCreatedAccount')(event)) {
        return E.right(resourceFromCreationEvent(event));
      }
      if (isEventOfType('UserDetailsUpdated')(event)) {
        return pipe(
          resource,
          E.map((userResource) => ({
            ...userResource,
            avatarUrl: event.avatarUrl ?? userResource.avatarUrl,
            displayName: event.displayName ?? userResource.displayName,
          })),
        );
      }
      return resource;
    },
  ),
);
