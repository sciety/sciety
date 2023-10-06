import {
  click, closeBrowser, currentURL, goto, openBrowser, radioButton,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
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

    describe('and saves an article that isn\'t in any list, without creating an annotation', () => {
      beforeAll(async () => {
        await click('Save this article');
        await click(radioButton(`${userHandle}'s saved articles`));
        await click('Save article');
      });

      it('i am returned to the same article page', async () => {
        expect(await currentURL()).toContain(articlePage);
      });
    });
  });
});
