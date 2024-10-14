import {
  $, click, closeBrowser, currentURL, goto, into, openBrowser, textBox, write,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { getIdOfFirstListOwnedByUser } from './helpers/get-first-list-owned-by.helper';
import { inputFieldNames } from '../src/standards';
import { ListId } from '../src/types/list-id';
import { arbitraryString } from '../test/helpers';
import { arbitraryExpressionDoi } from '../test/types/expression-doi.helper';
import { arbitraryUserId } from '../test/types/user-id.helper';

describe('create-annotation', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(async () => {
    await closeBrowser();
  });

  describe('given I am logged in', () => {
    const userId = arbitraryUserId();
    let listId: ListId;

    beforeEach(async () => {
      await createUserAccountAndLogIn(userId);
      listId = await getIdOfFirstListOwnedByUser(userId);
    });

    describe('with an article on my list', () => {
      beforeEach(async () => {
        await goto(`localhost:8080/articles/${arbitraryExpressionDoi()}`);
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

        it('i am back on the list page and the annotation is visible', async () => {
          expect(await currentURL()).toContain(listId);

          const annotation = await $('.article-card-annotation').text();

          expect(annotation).toContain(annotationContent);
        });
      });
    });
  });
});
