import {
  $, click, closeBrowser, currentURL, goto, into, openBrowser, textBox, write,
} from 'taiko';
import { arbitraryString } from '../test/helpers';
import { arbitraryArticleId } from '../test/types/article-id.helper';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { getIdOfFirstListOwnedByUser } from './helpers/get-first-list-owned-by.helper';
import { inputFieldNames } from '../src/standards';

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
        await click('Save this article');
        await click($('button[type="submit"]'));
      });

      describe('when I annotate the article', () => {
        const annotationContent = arbitraryString();

        beforeEach(async () => {
          await click('saved articles');
          await click('Add comment');
          await write(annotationContent, into(textBox({ name: inputFieldNames.annotationContent })));
          await click($('button[type="submit"]'));
        });

        it('i am back on the list page', async () => {
          const currentPage = await currentURL();
          const listId = await getIdOfFirstListOwnedByUser(userId);

          expect(currentPage).toContain(`http://localhost:8080/lists/${listId}`);
        });

        it('the annotation is visible', async () => {
          const annotation = await $('.article-card-annotation').text();

          expect(annotation).toContain(annotationContent);
        });
      });
    });
  });
});
