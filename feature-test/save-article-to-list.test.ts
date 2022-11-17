/* eslint-disable jest-formatting/padding-around-all */
import {
  $, click, closeBrowser, currentURL, goto, listItem, openBrowser,
} from 'taiko';
import { getFirstListOwnedBy } from './get-first-list-owned-by.helper';

describe('save-article-to-list', () => {
  describe('when a new user logs in and saves an article that isn\'t in any list', () => {
    const userHandle = 'DavidAshbrook';
    const testUserId = '931653361';
    const userProfilePage = `localhost:8080/users/${userHandle}`;
    const scietyFeedPage = 'localhost:8080/sciety-feed';

    const articleId = '10.1101/2022.06.06.494969';
    const articlePage = `localhost:8080/articles/activity/${articleId}`;
    const articleSearchResultsPage = `localhost:8080/search?query=${articleId}`;

    const articleCardSelector = `.article-card__link[href="/articles/activity/${articleId}"]`;
    const articleCardDeleteButtonSelector = '.article-card form[action="/forms/remove-article-from-list"]';
    const listCardSelector = '.list-card';
    const listCardTimeSelector = '.list-card time';

    beforeAll(async () => {
      await openBrowser();
      await goto(`localhost:8080/log-in-as?userId=${testUserId}`);
      await goto(articlePage);
      await click('Save to my list');
    });

    afterAll(async () => {
      await closeBrowser();
    });

    it('the article appears in the generic list page', async () => {
      const listId = await getFirstListOwnedBy(testUserId);
      const userGenericListPageUrl = `localhost:8080/lists/${listId}`;
      await goto(userGenericListPageUrl);
      const articleIsDisplayed = await $(articleCardSelector).exists();
      expect(articleIsDisplayed).toBe(true);
    });

    it('the article card on the list page offers a delete button', async () => {
      const listId = await getFirstListOwnedBy(testUserId);
      const userGenericListPageUrl = `localhost:8080/lists/${listId}`;
      await goto(userGenericListPageUrl);
      const deleteButton = $(articleCardDeleteButtonSelector);
      expect(await deleteButton.exists()).toBe(true);
    });

    it('the article is counted in the list card on the user profile page', async () => {
      await goto(userProfilePage);
      const cardText = await $(listCardSelector).text();
      expect(cardText).toContain('1 article');
    });

    it('the last updated date in the list card on the user profile page', async () => {
      await goto(userProfilePage);
      const lastUpdatedDate = await $(listCardTimeSelector).attribute('datetime');
      const today = (new Date()).toISOString().split('T')[0];
      expect(lastUpdatedDate).toBe(today);
    });

    it('the user\'s action appears in the Sciety feed', async () => {
      await goto(scietyFeedPage);
      const cardText = await listItem(userHandle).text();
      expect(cardText).toContain(`${userHandle} added an article`);
    });

    it('the list count of the article card on the search page increases by one', async () => {
      await goto(articleSearchResultsPage);
      const cardText = await $('.article-card').text();
      expect(cardText).toContain('Appears in 1 list');
    });

    it('the list count of the article card on the list page it is in increases by one', async () => {
      const listId = await getFirstListOwnedBy(testUserId);
      const userGenericListPageUrl = `localhost:8080/lists/${listId}`;
      await goto(userGenericListPageUrl);
      const cardText = await $('.article-card').text();
      expect(cardText).toContain('Appears in 1 list');
    });

    it.skip('the save article button on the article page is replaced with a link to the list', async () => {
      const listId = await getFirstListOwnedBy(testUserId);
      const userGenericListPageUrl = `localhost:8080/lists/${listId}`;
      await goto(articlePage);
      await click('Saved to my list');
      expect(await currentURL()).toBe(userGenericListPageUrl);
    });
  });
});
