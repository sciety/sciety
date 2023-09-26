import {
  click, closeBrowser, currentURL, goto, into, openBrowser, textBox, write,
} from 'taiko';
import { arbitraryArticleId } from '../test/types/article-id.helper';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { getIdOfFirstListOwnedByUser } from './helpers/get-first-list-owned-by.helper';

describe('create-annotation', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(async () => {
    await closeBrowser();
  });

  describe('given I am logged in', () => {
    const userId = arbitraryUserId();

    beforeEach(async () => {
      await createUserAccountAndLogIn(userId);
    });

    describe('with an article on my list', () => {
      beforeEach(async () => {
        await goto(`localhost:8080/articles/${arbitraryArticleId().value}`);
        await click('Save article');
      });

      describe('when I annotate the article', () => {
        beforeEach(async () => {
          await click('saved articles');
          await click('Add annotation');
          await write('abc', into(textBox('Annotation content')));
          await click('Create annotation');
        });

        it('i am back on the list page', async () => {
          const currentPage = await currentURL();
          const listId = await getIdOfFirstListOwnedByUser(userId);

          expect(currentPage).toBe(`http://localhost:8080/lists/${listId}`);
        });

        it.todo('the annotation is visible');
      });
    });
  });
});
