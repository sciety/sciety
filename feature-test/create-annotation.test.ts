import {
  click, closeBrowser, goto, openBrowser,
} from 'taiko';
import { arbitraryArticleId } from '../test/types/article-id.helper';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';

describe('create-annotation', () => {
  beforeEach(async () => {
    await openBrowser({ headless: false });
  });

  afterEach(async () => {
    await closeBrowser();
  });

  describe('given I am logged in', () => {
    beforeEach(async () => {
      await createUserAccountAndLogIn(arbitraryUserId());
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
        });

        it.todo('i am back on the list page');

        it.todo('the annotation is visible');
      });
    });
  });
});
