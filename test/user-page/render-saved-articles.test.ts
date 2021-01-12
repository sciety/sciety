import * as E from 'fp-ts/lib/Either';
import toUserId from '../../src/types/user-id';
import { renderSavedArticles } from '../../src/user-page/render-saved-articles';

describe('render-saved-articles', () => {
  describe('when there are saved articles', () => {
    it('renders an HTML ordered list', async () => {
      const rendered = await renderSavedArticles(toUserId('1295307136415735808'))();

      expect(rendered).toStrictEqual(E.right(expect.stringContaining('<ol')));
    });
  });

  describe('when there are no saved articles', () => {});
});
