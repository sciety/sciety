import {
  click, closeBrowser, currentURL, goto, openBrowser, $,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper.js';
import { arbitraryUserId } from '../test/types/user-id.helper.js';
import { arbitraryUserHandle } from '../test/types/user-handle.helper.js';
import { ListId } from '../src/types/list-id.js';
import { getIdOfFirstListOwnedByUser } from './helpers/get-first-list-owned-by.helper.js';

describe('save-article-to-list', () => {
  describe('when a new user logs in and visits an article page', () => {
    const userHandle = arbitraryUserHandle();
    const testUserId = arbitraryUserId();
    const articleId = '10.1101/2022.06.06.494969';
    const articlePage = `localhost:8080/articles/activity/${articleId}`;
    let listId: ListId;

    beforeEach(async () => {
      await openBrowser();
      await createUserAccountAndLogIn(testUserId, userHandle);
      listId = await getIdOfFirstListOwnedByUser(testUserId);
      await goto(articlePage);
    });

    afterEach(async () => {
      await closeBrowser();
    });

    describe('and saves an article that isn\'t in any list, without creating an annotation', () => {
      beforeEach(async () => {
        await click('Save this article');
        await click($('button[type="submit"]'));
      });

      it('i am taken to the list page', async () => {
        expect(await currentURL()).toContain(listId);
      });
    });
  });
});
