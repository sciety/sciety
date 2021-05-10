import { toUserId, UserId } from '../../src/types/user-id';
import { arbitraryWord } from '../helpers';

export const arbitraryUserId = (): UserId => toUserId(arbitraryWord());
