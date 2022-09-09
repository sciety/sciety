import {
  $, click, closeBrowser, currentURL, goto, listItem, openBrowser,
} from 'taiko';

describe('save-article-to-list', () => {
  describe('given the user is logged in', () => {
    const testUserId = '1295307136415735808';

    beforeAll(async () => {
      await openBrowser();
      await goto(`localhost:8080/log-in-as?userId=${testUserId}`);
    });

    afterAll(async () => {
      await closeBrowser();
    });

    describe.skip('and the user already has a generic list', () => {
      describe('when the user saves an article that isn\'t in any list', () => {
        const articleId = '10.1101/2021.12.06.471423';

        beforeAll(async () => {
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

    describe('and the user only has an empty default user list', () => {
      const userHandle = 'scietyHQ';

      describe('when the user saves an article that isn\'t in any list', () => {
        const articleId = '10.1101/2021.12.06.471423';

        beforeAll(async () => {
          await goto(`localhost:8080/articles/activity/${articleId}`);
          await click('Save to my list');
        });

        it('the article should appear in the list page', async () => {
          await goto(`localhost:8080/users/${userHandle}/lists/saved-articles`);

          const articleIsDisplayed = await $(`.article-card__link[href="/articles/activity/${articleId}"]`).exists();

          expect(articleIsDisplayed).toBe(true);
        });

        it('the article card on the list page offers a delete button', async () => {
          await goto(`localhost:8080/users/${userHandle}/lists/saved-articles`);

          const deleteButton = $('.article-card form[action="/unsave-article"]');

          expect(await deleteButton.exists()).toBe(true);
        });

        it('the article is counted in the list card on the user account page', async () => {
          await goto(`localhost:8080/users/${userHandle}`);

          const cardText = await $('.list-card').text();

          expect(cardText).toContain('1 article');
        });

        it('the last updated date in the list card on the user account page', async () => {
          await goto(`localhost:8080/users/${userHandle}`);

          const lastUpdatedDate = await $('.list-card time').attribute('datetime');
          const today = (new Date()).toISOString().split('T')[0];

          expect(lastUpdatedDate).toBe(today);
        });

        it('the user\'s action appears in the Sciety feed', async () => {
          await goto('localhost:8080/sciety-feed');

          const cardText = await listItem(userHandle).text();

          expect(cardText).toContain(`${userHandle} saved an article`);
        });

        it('the list count of the article card on the search page increases by one', async () => {
          await goto(`localhost:8080/search?query=${articleId}`);

          const cardText = await $('.article-card').text();

          expect(cardText).toContain('Appears in 1 list');
        });

        it('the list count of the article card on the list page it is in increases by one', async () => {
          await goto(`localhost:8080/users/${userHandle}/lists/saved-articles`);

          const cardText = await $('.article-card').text();

          expect(cardText).toContain('Appears in 1 list');
        });

        it.skip('the save article button on the article page is replaced with a link to the list', async () => {
          await goto(`localhost:8080/articles/activity/${articleId}`);

          await click('Saved to my list');

          expect(await currentURL()).toBe(`http://localhost:8080/users/${userHandle}/lists/saved-articles`);
        });
      });
    });
  });
});
