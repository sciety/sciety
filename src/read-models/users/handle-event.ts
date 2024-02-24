/* eslint-disable no-param-reassign */
import { DomainEvent, isEventOfType } from '../../domain-events/index.js';
import { UserDetails } from '../../types/user-details.js';
import { UserId } from '../../types/user-id.js';

export type ReadModel = Record<UserId, UserDetails>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readModel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('UserCreatedAccount')(event)) {
    readModel[event.userId] = {
      avatarUrl: event.avatarUrl,
      displayName: event.displayName,
      handle: event.handle,
      id: event.userId,
    };
  }
  if (isEventOfType('UserDetailsUpdated')(event)) {
    const existingUserDetails = readModel[event.userId];
    readModel[event.userId].avatarUrl = event.avatarUrl ?? existingUserDetails.avatarUrl;
    readModel[event.userId].displayName = event.displayName ?? existingUserDetails.displayName;
  }
  return readModel;
};
