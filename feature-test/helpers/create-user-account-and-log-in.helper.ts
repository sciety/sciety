import {
  click, goto, into, textBox, write,
} from 'taiko';
import { arbitraryString, arbitraryUri } from '../../test/helpers.js';
import { UserId } from '../../src/types/user-id.js';
import { arbitraryUserHandle } from '../../test/types/user-handle.helper.js';
import { callApi } from './call-api.helper.js';
import { UserHandle } from '../../src/types/user-handle.js';

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
