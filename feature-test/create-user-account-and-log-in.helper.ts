import {
  click, goto, into, textBox, write,
} from 'taiko';
import { arbitraryString, arbitraryUri } from '../test/helpers';
import { UserId } from '../src/types/user-id';
import { arbitraryUserHandle } from '../test/types/user-handle.helper';
import { callApi } from './call-api.helper';

export const createUserAccountAndLogIn = async (userId: UserId) => {
  await callApi('api/create-user', {
    userId,
    handle: arbitraryUserHandle(),
    avatarUrl: arbitraryUri(),
    displayName: arbitraryString(),
  });
  await goto('localhost:8080/');
  await click('Log In');
  await write(userId, into(textBox('User id')));
  await click('Log in');
};
