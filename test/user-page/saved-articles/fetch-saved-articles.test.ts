import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Doi } from '../../../src/types/doi';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { fetchSavedArticles } from '../../../src/user-page/saved-articles/fetch-saved-articles';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('fetch-get-saved-articles', () => {
  describe('when the user has saved articles', () => {
    it('returns doi and title for those articles', async () => {
      const getArticle = () => pipe(
        'Gender, race and parenthood',
        toHtmlFragment,
        O.some,
        T.of,
      );
      const savedArticles = await fetchSavedArticles(getArticle)([new Doi('10.1101/2020.07.04.187583')])();

      expect(savedArticles[0]).toMatchObject({
        doi: new Doi('10.1101/2020.07.04.187583'),
        title: O.some(toHtmlFragment('Gender, race and parenthood')),
      });
    });
  });

  describe('when the user has no saved articles', () => {
    it('returns an empty array', async () => {
      const savedArticles = await fetchSavedArticles(shouldNotBeCalled)([])();

      expect(savedArticles).toHaveLength(0);
    });
  });
});
