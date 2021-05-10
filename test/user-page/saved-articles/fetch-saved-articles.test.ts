import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { fetchSavedArticles } from '../../../src/user-page/saved-articles/fetch-saved-articles';
import { arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';

describe('fetch-get-saved-articles', () => {
  describe('when the user has saved articles', () => {
    it('returns doi and title for those articles', async () => {
      const articleId = arbitraryDoi();
      const title = pipe(
        arbitraryString(),
        toHtmlFragment,
        O.some,
      );
      const getArticle = () => T.of(title);
      const savedArticles = await fetchSavedArticles(getArticle)([articleId])();

      expect(savedArticles[0]).toMatchObject({
        doi: articleId,
        title,
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
