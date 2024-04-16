import {
  click, goto, into, textBox, write,
} from 'taiko';
import { callApi } from './call-api.helper';
import { UserHandle } from '../../src/types/user-handle';
import { UserId } from '../../src/types/user-id';
import { arbitraryString, arbitraryUri } from '../../test/helpers';
import { arbitraryUserHandle } from '../../test/types/user-handle.helper';

export const createUserAccountAndLogIn = async (
  userId: UserId,
  handle: UserHandle = arbitraryUserHandle(),
  avatarUrl: string = arbitraryUri(),
): Promise<void> => {
  await callApi('api/create-user', {
    userId,
    handle,
    avatarUrl,
    displayName: arbitraryString(),
  });
  await goto('localhost:8080/');
  await click('Log In');
  await write(userId, into(textBox('User id')));
  await click('Log in');
};
