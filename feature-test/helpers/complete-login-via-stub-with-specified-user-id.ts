import {
  click, into, write, textBox,
} from 'taiko';

export const completeLoginViaStubWithSpecifiedUserId = async (userId: string): Promise<void> => {
  await write(userId, into(textBox('User id')));
  await click('Log in as test user');
};
