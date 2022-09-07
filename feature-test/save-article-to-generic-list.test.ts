import {
  click, goto, openBrowser,
} from 'taiko';
import { screenshotTeardown } from './utilities';

describe('save-article-to-generic-list', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('given the user is logged in', () => {
    const testUserId = '1338873008283377664';

    beforeEach(async () => {
      await goto('localhost:8080/');
      await click('Log in');
    });

    describe('and the user already has a generic list', () => {
      describe('when the user saves the article', () => {
        beforeEach(async () => {
          await goto('localhost:8080/articles/activity/10.1101/2021.12.06.471423');
          await click('Save to my list');
        });

        it.skip('the article should appear in the user\'s generic list', async () => {
          await goto(`localhost:8080/lists/list-id-${testUserId}`);

          expect(true).toBe(false);
        });
      });
    });
  });
});
