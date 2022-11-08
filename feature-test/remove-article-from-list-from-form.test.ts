import {
  $,
  goto,
} from 'taiko';
import { noArticlesMessage } from '../src/generic-list-page/articles-list/static-messages';

describe('remove-article-from-list-from-form', () => {
  describe('when the user is logged in', () => {
    describe('and has saved an article', () => {
      describe('and they click the trash can', () => {
        const contentSelector = 'main';
        const genericListPage = 'localhost:8080/lists/12345';

        it.todo('they should be redirected to the generic list page');

        it.failing('the article should no longer be in the list', async () => {
          await goto(genericListPage);
          const content = await $(contentSelector).text();

          expect(content).toContain(noArticlesMessage);
        });
      });
    });
  });
});
