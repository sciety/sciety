import { CreateUserAccountCommand } from '../../../src/write-side/commands';
import { arbitraryUri, arbitraryWord } from '../../helpers';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryUserHandle } from '../../types/user-handle.helper';

// ts-unused-exports:disable-next-line
export const arbitraryCreateUserAccountCommand = (): CreateUserAccountCommand => ({
  userId: arbitraryUserId(),
  handle: arbitraryUserHandle(),
  avatarUrl: arbitraryUri(),
  displayName: arbitraryWord(),
});
