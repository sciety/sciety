/* eslint-disable jest-formatting/padding-around-all */
import axios from 'axios';
import {
  $, click, closeBrowser, currentURL, goto, listItem, openBrowser,
} from 'taiko';

const getFirstListOwnedBy = async (userId: string) => {
  const userList = await axios.get(`http://localhost:8081/owned-by/user-id:${userId}`);
  expect(userList.data.items).toHaveLength(1);
  const listId = userList.data.items[0].id as unknown as string;
  return listId;
};

describe('save-article-to-list', () => {
  const pageHeaderDescriptionSelector = '.page-header__description';

  describe('given the user is logged in', () => {
    describe('and the user already has a generic list', () => {
      const userHandle = 'DavidAshbrook';
      const testUserId = '931653361';
      const userProfilePage = `localhost:8080/users/${userHandle}`;
      const genericListPage = `localhost:8080/lists/list-id-${testUserId}`;
      const scietyFeedPage = 'localhost:8080/sciety-feed';

      beforeAll(async () => {
        await openBrowser();
        await goto(`localhost:8080/log-in-as?userId=${testUserId}`);
      });

      afterAll(async () => {
        await closeBrowser();
      });

      describe('when the user saves an article that isn\'t in any list', () => {
        const articleId = '10.1101/2022.06.06.494969';
        const articlePage = `localhost:8080/articles/activity/${articleId}`;
        const articleSearchResultsPage = `localhost:8080/search?query=${articleId}`;

        const articleCardSelector = `.article-card__link[href="/articles/activity/${articleId}"]`;
        const articleCardDeleteButtonSelector = '.article-card form[action="/unsave-article"]';
        const listCardSelector = '.list-card';
        const listCardTimeSelector = '.list-card time';

        beforeAll(async () => {
          await goto(articlePage);
          await click('Save to my list');
        });

        it('the article appears in the list page', async () => {
          await goto(genericListPage);
          const articleIsDisplayed = await $(articleCardSelector).exists();
          expect(articleIsDisplayed).toBe(true);
        });

        it.skip('the article card on the list page offers a delete button', async () => {
          await goto(genericListPage);
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

        it.skip('the user\'s action appears in the Sciety feed', async () => {
          await goto(scietyFeedPage);
          const cardText = await listItem(userHandle).text();
          expect(cardText).toContain(`${userHandle} saved an article`);
        });

        it.failing('the list count of the article card on the search page increases by one', async () => {
          await goto(articleSearchResultsPage);
          const cardText = await $('.article-card').text();
          expect(cardText).toContain('Appears in 1 list');
        });

        it.skip('the list count of the article card on the list page it is in increases by one', async () => {
          await goto(genericListPage);
          const cardText = await $('.article-card').text();
          expect(cardText).toContain('Appears in 1 list');
        });

        it.skip('the save article button on the article page is replaced with a link to the list', async () => {
          await goto(articlePage);
          await click('Saved to my list');
          expect(await currentURL()).toBe(genericListPage);
        });
      });
    });

    describe('and the user only has an empty default user list page and not a generic list', () => {
      const userHandle = 'scietyHQ';
      const testUserId = '1295307136415735808';
      const userSavedArticlesPage = `localhost:8080/users/${userHandle}/lists/saved-articles`;
      const userProfilePage = `localhost:8080/users/${userHandle}`;
      const scietyFeedPage = 'localhost:8080/sciety-feed';

      beforeAll(async () => {
        await openBrowser();
        await goto(`localhost:8080/log-in-as?userId=${testUserId}`);
      });

      afterAll(async () => {
        await closeBrowser();
      });

      describe('when the user saves an article that isn\'t in any list', () => {
        const articleId = '10.1101/2021.12.06.471423';
        const articlePage = `localhost:8080/articles/activity/${articleId}`;
        const articleSearchResultsPage = `localhost:8080/search?query=${articleId}`;

        const articleCardSelector = `.article-card__link[href="/articles/activity/${articleId}"]`;
        const articleCardDeleteButtonSelector = '.article-card form[action="/unsave-article"]';
        const listCardSelector = '.list-card';
        const listCardTimeSelector = '.list-card time';

        beforeAll(async () => {
          await goto(articlePage);
          await click('Save to my list');
        });

        it('the article appears in the list page', async () => {
          await goto(userSavedArticlesPage);
          const articleIsDisplayed = await $(articleCardSelector).exists();
          expect(articleIsDisplayed).toBe(true);
        });

        it('the article card on the list page offers a delete button', async () => {
          await goto(userSavedArticlesPage);
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
          expect(cardText).toContain(`${userHandle} saved an article`);
        });

        it('the list count of the article card on the search page increases by one', async () => {
          await goto(articleSearchResultsPage);
          const cardText = await $('.article-card').text();
          expect(cardText).toContain('Appears in 1 list');
        });

        it('the list count of the article card on the list page it is in increases by one', async () => {
          await goto(userSavedArticlesPage);
          const cardText = await $('.article-card').text();
          expect(cardText).toContain('Appears in 1 list');
        });

        it.skip('the save article button on the article page is replaced with a link to the list', async () => {
          await goto(articlePage);
          await click('Saved to my list');
          expect(await currentURL()).toBe(userSavedArticlesPage);
        });

        it('the user now has a generic list page', async () => {
          const listId = await getFirstListOwnedBy(testUserId);
          const userGenericListPageUrl = `localhost:8080/lists/${listId}`;
          await goto(userGenericListPageUrl);
          const description = await $(pageHeaderDescriptionSelector).text();
          expect(description).toContain(userHandle);
        });
      });
    });
  });

  describe('a user has a user list page with one article and an empty generic list', () => {
    const testUserId = '56806677';
    const articleId = '10.1101/2022.10.01.510447';
    const articleCardSelector = `.article-card__link[href="/articles/activity/${articleId}"]`;

    beforeAll(async () => {
      await openBrowser();
    });

    afterAll(async () => {
      await closeBrowser();
    });

    it('that article appears on their generic list page', async () => {
      const listId = await getFirstListOwnedBy(testUserId);
      const genericListPage = `localhost:8080/lists/${listId}`;
      await goto(genericListPage);
      const articleIsDisplayed = await $(articleCardSelector).exists();
      expect(articleIsDisplayed).toBe(true);
    });
  });

  describe('a user has unsaved an article', () => {
    it.todo('that article does not appear on their generic list page');
  });
});
