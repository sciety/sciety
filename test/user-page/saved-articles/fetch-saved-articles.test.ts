import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
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
      );
      const getArticle = () => T.of(E.right({ title }));
      const savedArticles = await pipe(
        fetchSavedArticles(getArticle)([articleId]),
        TE.getOrElse(() => { throw new Error('Cannot happen'); }),
      )();

      expect(savedArticles[0]).toMatchObject({
        doi: articleId,
        title,
      });
    });
  });

  describe('when the user has no saved articles', () => {
    it('returns an empty array', async () => {
      const savedArticles = await fetchSavedArticles(shouldNotBeCalled)([])();

      expect(savedArticles).toStrictEqual(E.right([]));
    });
  });
});
