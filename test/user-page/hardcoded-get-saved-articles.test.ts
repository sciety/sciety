import * as O from 'fp-ts/lib/Option';
import Doi from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import toUserId from '../../src/types/user-id';
import { getSavedArticles } from '../../src/user-page/hardcoded-get-saved-articles';

describe('hardcoded-get-saved-articles', () => {
  describe('when the user has saved articles', () => {
    it('returns doi and title for those articles', async () => {
      const savedArticles = await getSavedArticles(toUserId('1295307136415735808'))();

      expect(savedArticles[0]).toMatchObject({
        doi: new Doi('10.1101/2020.07.04.187583'),
        title: O.some(toHtmlFragment('Gender, race and parenthood impact academic productivity during the COVID-19 pandemic: from survey to action')),
      });
    });
  });

  describe('when the user has no saved articles', () => {
    it('returns an empty array', async () => {
      const savedArticles = await getSavedArticles(toUserId('anything-else'))();

      expect(savedArticles).toHaveLength(0);
    });
  });
});
