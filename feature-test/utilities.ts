import {
  click, into, textBox, write,
} from 'taiko';

export const authenticateViaTwitter = async ():Promise<void> => {
  await write(process.env.TAIKO_TWITTER_USERNAME ?? '', into(textBox('Username')));
  await write(process.env.TAIKO_TWITTER_PASSWORD ?? '', into(textBox('Password')));
  await click('Sign in');
};
