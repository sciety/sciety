import { CreateUserAccountCommand } from '../../../src/write-side/commands';
import { arbitraryWord } from '../../helpers';
import { arbitraryUserHandle } from '../../types/user-handle.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

export const arbitraryCreateUserAccountCommand = (): CreateUserAccountCommand => ({
  userId: arbitraryUserId(),
  handle: arbitraryUserHandle(),
  displayName: arbitraryWord(),
});
