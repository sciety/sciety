import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { generateViewModel } from '../../src/sciety-feed-page/sciety-feed-page';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';

describe('save-article-to-list', () => {
  describe('given the user is logged in', () => {
    describe('and the user only has an empty default user list', () => {
      beforeAll(async () => {
        // await goto(`localhost:8080/log-in-as?userId=${testUserId}`);
      });

      describe('when the user saves an article that isn\'t in any list', () => {
        beforeEach(async () => {
          // await goto(articlePage);
          // await click('Save to my list');
        });

        it.failing('the user\'s action appears in the Sciety feed', async () => {
          const adapters = {
            getAllEvents: T.of([]),
            getUserDetails: () => TE.right({
              handle: arbitraryWord(),
              avatarUrl: arbitraryUri(),
            }),
            fetchArticle: () => TE.right({
              doi: arbitraryArticleId(),
              title: toHtmlFragment(arbitraryString()),
              authors: O.none,
            }),
          };
          const params = {
            page: 1,
          };
          const viewModel = await pipe(
            params,
            generateViewModel(adapters)(20),
            TE.getOrElse(shouldNotBeCalled),
          )();

          expect(viewModel.items).toHaveLength(1);
        });
      });
    });
  });
});
