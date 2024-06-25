import {
  $,
  click, closeBrowser,
  currentURL,
  goto,
  openBrowser,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { getIdOfFirstListOwnedByUser } from './helpers/get-first-list-owned-by.helper';
import { arbitraryExpressionDoi } from '../test/types/expression-doi.helper';
import { arbitraryUserId } from '../test/types/user-id.helper';

describe('remove-article-from-list', () => {
  beforeAll(async () => {
    await openBrowser();
  });

  afterAll(async () => {
    await closeBrowser();
  });

  describe('when the user is logged in', () => {
    const testUserId = arbitraryUserId();

    beforeAll(async () => {
      await createUserAccountAndLogIn(testUserId);
    });

    describe('and has saved an article', () => {
      const expressionDoi = arbitraryExpressionDoi();
      const articlePage = `localhost:8080/articles/activity/${expressionDoi}`;

      beforeAll(async () => {
        await goto(articlePage);
        await click('Save this article');
        await click($('button[type="submit"]'));
      });

      describe('and they click the trash can', () => {
        const contentSelector = 'main';
        let listPage: string;
        let content: string;

        beforeAll(async () => {
          const listId = await getIdOfFirstListOwnedByUser(testUserId);
          listPage = `localhost:8080/lists/${listId}`;
          await goto(listPage);
          const articleCardDeleteButtonSelector = 'button[aria-label="Remove this article from the list"]';
          const deleteButton = $(articleCardDeleteButtonSelector);
          await click(deleteButton);
        });

        it('they should be redirected to the list page', async () => {
          expect(await currentURL()).toContain(listPage);
        });

        it('the article should no longer be in the list', async () => {
          await goto(listPage);
          content = await $(contentSelector).text();

          expect(content).toContain('This list is currently empty.');
        });
      });
    });
  });
});
