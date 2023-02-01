import {
  click, into, write, textBox,
} from 'taiko';

export const logInWithSpecifiedUserId = async (userId: string) => {
  await write(userId, into(textBox('User id')));
  await click('Log in');
};
