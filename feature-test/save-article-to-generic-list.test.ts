import {
  $, click, goto, openBrowser,
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
      describe('when the user saves an article that isn\'t in any list', () => {
        const articleId = '10.1101/2021.12.06.471423';

        beforeEach(async () => {
          await goto(`localhost:8080/articles/activity/${articleId}`);
          await click('Save to my list');
        });

        it.skip('the article should appear in the list page', async () => {
          await goto(`localhost:8080/lists/list-id-${testUserId}`);

          const articleIsDisplayed = await $(`.article-card__link[href="/articles/activity/${articleId}"]`).exists();

          expect(articleIsDisplayed).toBe(true);
        });

        it.todo('the article is counted in the list card on the user account page');

        it.todo('the user\'s action appears in the Sciety feed');

        it.todo('the list count of the article card on the search page increases by one');

        it.todo('the list count of the article card on the list page it is in increases by one');

        it.todo('the last updated date of the list card on the user\'s list page is updated');

        it.todo('the save article button on the article\'s page is replaced with link to the list');

        it.todo('the article card on the list page offers a delete button');
      });
    });
  });
});
