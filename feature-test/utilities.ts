import { closeBrowser, screenshot } from 'taiko';

export const screenshotTeardown = async (): Promise<void> => {
  await screenshot({ path: `./feature-test/screenshots/${expect.getState().currentTestName}.png` });
  await closeBrowser();
};
