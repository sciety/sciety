import { arbitraryUserId } from './user-id.helper';
import { UserDetails } from '../../src/types/user-details';
import { arbitraryString, arbitraryUri } from '../helpers';
import { arbitraryUserHandle } from './user-handle.helper';

export const arbitraryUserDetails = (): UserDetails => ({
  id: arbitraryUserId(),
  avatarUrl: arbitraryUri(),
  displayName: arbitraryString(),
  handle: arbitraryUserHandle(),
});
