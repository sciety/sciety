const dotenv = require('dotenv');
const assert = require('assert').strict;
const {
  openBrowser, goto, click, closeBrowser, into, textBox, write, link,
} = require('taiko');

dotenv.config();

(async () => {
  try {
    await openBrowser();
    await goto('localhost:8080');
    await click('Log in');
    await write(process.env.TAIKO_TWITTER_USERNAME, into(textBox('Username')));
    await write(process.env.TAIKO_TWITTER_PASSWORD, into(textBox('Password')));
    await click('Sign in');
    await assert.ok(await link('Log out').exists());
  } catch (error) {
    console.error(error);
  } finally {
    await closeBrowser();
  }
})();
