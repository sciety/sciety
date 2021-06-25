import {
  click, closeBrowser, into, screenshot, textBox, write,
} from 'taiko';

export const authenticateViaTwitter = async (): Promise<void> => {
  //if (process.env.TAIKO_TWITTER_USERNAME && process.env.TAIKO_TWITTER_PASSWORD) {
  //  await write(process.env.TAIKO_TWITTER_USERNAME ?? '', into(textBox('Username')));
  //  await write(process.env.TAIKO_TWITTER_PASSWORD ?? '', into(textBox('Password')));
  //  await click('Sign in');
  //} else {
  //  throw new Error('Missing TAIKO_TWITTER_USERNAME and/or TAIKO_TWITTER_PASSWORD env vars');
  //}
};

export const screenshotTeardown = async (): Promise<void> => {
  await screenshot({ path: `./feature-test/screenshots/${expect.getState().currentTestName}.png` });
  await closeBrowser();
};
