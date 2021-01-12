import * as E from 'fp-ts/lib/Either';
import Doi from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import toUserId from '../../src/types/user-id';
import { GetSavedArticles, renderSavedArticles } from '../../src/user-page/render-saved-articles';

describe('render-saved-articles', () => {
  describe('when there are saved articles', () => {
    it('renders an HTML ordered list', async () => {
      const savedArticles: GetSavedArticles = () => [
        {
          doi: new Doi('10.1101/2020.07.04.187583'),
          title: toHtmlFragment('Gender, race and parenthood impact academic productivity during the COVID-19 pandemic: from survey to action'),
        },
      ];
      const rendered = await renderSavedArticles(savedArticles)(toUserId('1295307136415735808'))();

      expect(rendered).toStrictEqual(E.right(expect.stringContaining('<ol')));
    });
  });

  describe('when there are no saved articles', () => {
    it('renders nothing', async () => {
      const savedArticles: GetSavedArticles = () => [];
      const rendered = await renderSavedArticles(savedArticles)(toUserId('no-such-user'))();

      expect(rendered).toStrictEqual(E.right(''));
    });
  });
});
