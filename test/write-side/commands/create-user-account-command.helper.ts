import { CreateUserAccountCommand } from '../../../src/write-side/commands/index.js';
import { arbitraryUri, arbitraryWord } from '../../helpers.js';
import { arbitraryUserId } from '../../types/user-id.helper.js';
import { arbitraryUserHandle } from '../../types/user-handle.helper.js';

export const arbitraryCreateUserAccountCommand = (): CreateUserAccountCommand => ({
  userId: arbitraryUserId(),
  handle: arbitraryUserHandle(),
  avatarUrl: arbitraryUri(),
  displayName: arbitraryWord(),
});
