import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { Result } from 'true-myth';
import Doi from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import toUserId from '../../src/types/user-id';
import { GetArticleFromCrossref, getSavedArticles } from '../../src/user-page/hardcoded-get-saved-articles';
import shouldNotBeCalled from '../should-not-be-called';

describe('hardcoded-get-saved-articles', () => {
  describe('when the user has saved articles', () => {
    it('returns doi and title for those articles', async () => {
      const getArticleDois = ():ReadonlyArray<Doi> => [new Doi('10.1101/2020.07.04.187583')];
      const getArticle: GetArticleFromCrossref = () => T.of(Result.ok({ title: toHtmlFragment('Gender, race and parenthood') }));
      const savedArticles = await getSavedArticles(getArticle, getArticleDois)(toUserId('1295307136415735808'))();

      expect(savedArticles[0]).toMatchObject({
        doi: new Doi('10.1101/2020.07.04.187583'),
        title: O.some(toHtmlFragment('Gender, race and parenthood')),
      });
    });
  });

  describe('when the user has no saved articles', () => {
    it('returns an empty array', async () => {
      const getArticleDois = ():ReadonlyArray<Doi> => [];
      const savedArticles = await getSavedArticles(shouldNotBeCalled, getArticleDois)(toUserId('anything-else'))();

      expect(savedArticles).toHaveLength(0);
    });
  });
});
