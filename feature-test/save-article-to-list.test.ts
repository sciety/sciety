/* eslint-disable jest-formatting/padding-around-all */
import {
  $, click, closeBrowser, currentURL, goto, link, openBrowser,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { getIdOfFirstListOwnedByUser } from './helpers/get-first-list-owned-by.helper';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { arbitraryUserHandle } from '../test/types/user-handle.helper';

describe('save-article-to-list', () => {
  describe('when a new user logs in and visits an article page', () => {
    const userHandle = arbitraryUserHandle();
    const testUserId = arbitraryUserId();
    const articleId = '10.1101/2022.06.06.494969';
    const articlePage = `localhost:8080/articles/activity/${articleId}`;

    beforeAll(async () => {
      await openBrowser();
      await createUserAccountAndLogIn(testUserId, userHandle);
      await goto(articlePage);
    });

    afterAll(async () => {
      await closeBrowser();
    });

    describe.skip('and saves an article that isn\'t in any list, without creating an annotation', () => {
      const userProfilePage = `localhost:8080/users/${userHandle}`;
      const scietyFeedPage = 'localhost:8080/sciety-feed';

      const articleSearchResultsPage = `localhost:8080/search?query=${articleId}`;

      const articleCardDeleteButtonSelector = '.article-card form[action="/forms/remove-article-from-list"]';
      const listCardTimeSelector = '.list-card time';

      beforeAll(async () => {
        await click('Save article');
      });

      it('i am returned to the same article page', async () => {
        expect(await currentURL()).toContain(articlePage);
      });

      it('the article card on the list page offers a delete button', async () => {
        const listId = await getIdOfFirstListOwnedByUser(testUserId);
        const userListPageUrl = `localhost:8080/lists/${listId}`;
        await goto(userListPageUrl);
        const deleteButton = $(articleCardDeleteButtonSelector);
        expect(await deleteButton.exists()).toBe(true);
      });

      it('the last updated date in the list card on the user profile page', async () => {
        await goto(userProfilePage);
        const lastUpdatedDate = await $(listCardTimeSelector).attribute('datetime');
        const today = (new Date()).toISOString().split('T')[0];
        expect(lastUpdatedDate).toBe(today);
      });

      it('the user\'s action appears in the Sciety feed', async () => {
        await goto(scietyFeedPage);
        const mainText = await $('main').text();
        expect(mainText).toContain(`${userHandle} added an article`);
      });

      it.skip('the list count of the article card on the search page increases by one', async () => {
        await goto(articleSearchResultsPage);
        const cardText = await $('.article-card').text();
        expect(cardText).toContain('Appears in 1 list');
      });

      it('the save article button on the article page is replaced with a link to the list', async () => {
        const listId = await getIdOfFirstListOwnedByUser(testUserId);
        const userListPageUrl = `http://localhost:8080/lists/${listId}`;
        await goto(articlePage);
        await click(link({ href: `/lists/${listId}` }));
        expect(await currentURL()).toBe(userListPageUrl);
      });
    });
  });
});
