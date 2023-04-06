/* eslint-disable no-param-reassign */
import { DomainEvent, isUserCreatedAccountEvent, isUserDetailsUpdatedEvent } from '../../domain-events';
import { UserDetails } from '../../types/user-details';
import { UserId } from '../../types/user-id';

export type ReadModel = Record<UserId, UserDetails>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readModel: ReadModel, event: DomainEvent): ReadModel => {
  if (isUserCreatedAccountEvent(event)) {
    readModel[event.userId] = {
      avatarUrl: event.avatarUrl,
      displayName: event.displayName,
      handle: event.handle,
      id: event.userId,
    };
  }
  if (isUserDetailsUpdatedEvent(event)) {
    const existingUserDetails = readModel[event.userId];
    readModel[event.userId].avatarUrl = event.avatarUrl ?? existingUserDetails.avatarUrl;
    readModel[event.userId].displayName = event.displayName ?? existingUserDetails.displayName;
  }
  return readModel;
};
