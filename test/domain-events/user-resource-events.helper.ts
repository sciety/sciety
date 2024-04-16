import { constructEvent, EventOfType } from '../../src/domain-events';
import { arbitraryString, arbitraryUri } from '../helpers';
import { arbitraryUserHandle } from '../types/user-handle.helper';
import { arbitraryUserId } from '../types/user-id.helper';

export const arbitraryUserCreatedAccountEvent = (): EventOfType<'UserCreatedAccount'> => constructEvent('UserCreatedAccount')(
  {
    userId: arbitraryUserId(),
    avatarUrl: arbitraryUri(),
    displayName: arbitraryString(),
    handle: arbitraryUserHandle(),
  },
);

export const arbitraryUserDetailsUpdatedEvent = (): EventOfType<'UserDetailsUpdated'> => constructEvent('UserDetailsUpdated')({
  userId: arbitraryUserId(),
  avatarUrl: undefined,
  displayName: undefined,
});
