import dotenv from 'dotenv';
import {
  click, closeBrowser, goto, into, link, openBrowser, textBox, write,
} from 'taiko';

describe('authentication-and-redirect', () => {
  beforeEach(async () => {
    dotenv.config();
    await openBrowser();
  });

  afterAll(closeBrowser);

  it('log in works', async () => {
    await goto('localhost:8080');
    await click('Log in');
    await write(process.env.TAIKO_TWITTER_USERNAME ?? '', into(textBox('Username')));
    await write(process.env.TAIKO_TWITTER_PASSWORD ?? '', into(textBox('Password')));
    await click('Sign in');
    const result = await link('Log out').exists();

    expect(result).toBe(true);
  });

  describe('not logged in', () => {
    it.todo('log in from the article page returns to the article page');

    it.todo('respond command returns to review fragment on the article page');

    it.todo('follow command from the editorial community page returns to the editorial community page');
  });

  describe('logged in', () => {
    it.todo('log out from the article page returns to the article page');

    it.todo('respond command returns to review fragment on the article page');

    it.todo('follow command from the editorial community page returns to the editorial community page');
  });
});
