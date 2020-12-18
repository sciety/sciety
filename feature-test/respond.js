const dotenv = require('dotenv');
const assert = require('assert').strict;
const {
  openBrowser, goto, click, closeBrowser, into, textBox, write, link,
} = require('taiko');

dotenv.config();

(async () => {
  try {
    await openBrowser();
    await goto('localhost:8080/articles/10.1101/2020.07.13.199174');
    await click('Got it!');
    await click($('.article-feed__item:first-child button[value="respond-helpful"]'));
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
