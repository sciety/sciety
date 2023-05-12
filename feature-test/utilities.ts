import { closeBrowser, screenshot } from 'taiko';

export const screenshotTeardown = async (): Promise<void> => {
  try {
    const currentTestName = expect.getState().currentTestName ?? 'unknown-test';
    await screenshot({ path: `./feature-test/screenshots/${currentTestName}.png` });
    await closeBrowser();
  } catch (error: unknown) {
    process.stderr.write('Warning: cannot take a screenshot\n');
  }
};
