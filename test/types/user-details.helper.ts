import { arbitraryUserId } from './user-id.helper.js';
import { UserDetails } from '../../src/types/user-details.js';
import { arbitraryString, arbitraryUri } from '../helpers.js';
import { arbitraryUserHandle } from './user-handle.helper.js';

export const arbitraryUserDetails = (): UserDetails => ({
  id: arbitraryUserId(),
  avatarUrl: arbitraryUri(),
  displayName: arbitraryString(),
  handle: arbitraryUserHandle(),
});
