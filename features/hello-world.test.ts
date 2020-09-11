import assert from "assert";

const { openBrowser, goto, closeBrowser, text, write, press } = require('taiko');

describe('Taiko with Jest', () => {
  beforeAll(async () => {
    await openBrowser();
  });

  describe('Google search', () => {
    test('should use Taiko to search google', async () => {
      await goto('localhost:8080');
      expect(await text('The Hive').exists()).toBe(true);
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });
});
