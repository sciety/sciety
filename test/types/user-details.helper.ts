import { arbitraryUserId } from './user-id.helper';
import { UserDetails } from '../../src/types/user-details';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../helpers';

export const arbitraryUserDetails = (): UserDetails => ({
  id: arbitraryUserId(),
  avatarUrl: arbitraryUri(),
  displayName: arbitraryString(),
  handle: arbitraryWord(),
});
