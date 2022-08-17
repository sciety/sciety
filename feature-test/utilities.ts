import { closeBrowser, screenshot } from 'taiko';

export const screenshotTeardown = async (): Promise<void> => {
  const currentTestName = expect.getState().currentTestName ?? 'unknown-test';
  await screenshot({ path: `./feature-test/screenshots/${currentTestName}.png` });
  await closeBrowser();
};
