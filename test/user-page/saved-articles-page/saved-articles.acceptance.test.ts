import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { userSavedArticle } from '../../../src/types/domain-events';
import { savedArticles } from '../../../src/user-page/saved-articles-page/saved-articles';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('saved-articles acceptance', () => {
  describe('article details unavailable for any article', () => {
    it('displays a single error message', async () => {
      const userId = arbitraryUserId();
      const adapters = {
        getAllEvents: T.of([
          userSavedArticle(
            userId,
            arbitraryDoi(),
          ),
        ]),
        fetchArticle: () => TE.left('unavailable'),
        findReviewsForArticleDoi: shouldNotBeCalled,
        findVersionsForArticleDoi: shouldNotBeCalled,
      };
      const component = await savedArticles(adapters)(userId)();

      expect(component).toStrictEqual(E.right(expect.stringContaining('<p>We couldn\'t find this information; please try again later.</p>')));
    });
  });

  describe('user has no saved articles', () => {
    it.todo('does not render the component');
  });
});
