/* eslint-disable no-param-reassign */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { UserDetails } from '../../types/user-details';
import { UserId } from '../../types/user-id';

export type ReadModel = Record<UserId, UserDetails>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readModel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('UserCreatedAccount')(event)) {
    readModel[event.userId] = {
      displayName: event.displayName,
      handle: event.handle,
      id: event.userId,
    };
  }
  if (isEventOfType('UserDetailsUpdated')(event)) {
    const existingUserDetails = readModel[event.userId];
    readModel[event.userId].displayName = event.displayName ?? existingUserDetails.displayName;
  }
  return readModel;
};
