import axios from 'axios';
import {
  $,
  click,
  goto,
  openBrowser,
} from 'taiko';

const getFirstListOwnedBy = async (userId: string) => {
  const userList = await axios.get(`http://localhost:8081/owned-by/user-id:${userId}`);

  expect(userList.data.items).toHaveLength(1);

  const listId = userList.data.items[0].id as unknown as string;
  return listId;
};

describe('remove-article-from-list-from-form', () => {
  beforeAll(async () => {
    await openBrowser();
  });

  describe('when the user is logged in', () => {
    const testUserId = '1302891230918053888';

    beforeAll(async () => {
      await goto(`localhost:8080/log-in-as?userId=${testUserId}`);
    });

    describe('and has saved an article', () => {
      const articleId = '10.1101/2022.06.06.494969';
      const articlePage = `localhost:8080/articles/activity/${articleId}`;

      beforeAll(async () => {
        await goto(articlePage);
        await click('Save to my list');
      });

      describe('and they click the trash can', () => {
        const contentSelector = 'main';
        let genericListPage: string;
        let content: string;

        beforeAll(async () => {
          const listId = await getFirstListOwnedBy(testUserId);
          genericListPage = `localhost:8080/lists/${listId}`;
          await goto(genericListPage);
          const articleCardDeleteButtonSelector = '.article-card form[action="/remove-article-from-list-from-form"]';
          const deleteButton = $(articleCardDeleteButtonSelector);
          await click(deleteButton);
          await goto(genericListPage);
          content = await $(contentSelector).text();
        });

        it.todo('they should be redirected to the generic list page');

        it('the article should no longer be in the list', async () => {
          expect(content).toContain('This list is currently empty. Try coming back later!');
        });
      });
    });
  });
});
