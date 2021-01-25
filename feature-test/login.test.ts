import dotenv from 'dotenv';
import {
  click, closeBrowser, goto, into, link, openBrowser, textBox, write,
} from 'taiko';

describe('login', () => {
  beforeEach(async () => {
    dotenv.config();
    await openBrowser();
  });

  afterAll(closeBrowser);

  it('authenticates via Twitter', async () => {
    await goto('localhost:8080');
    await click('Log in');
    await write(process.env.TAIKO_TWITTER_USERNAME ?? '', into(textBox('Username')));
    await write(process.env.TAIKO_TWITTER_PASSWORD ?? '', into(textBox('Password')));
    await click('Sign in');
    const result = await link('Log out').exists();

    expect(result).toBe(true);
  });
});
