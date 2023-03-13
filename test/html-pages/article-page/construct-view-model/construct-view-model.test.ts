import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { constructViewModel, Ports } from '../../../../src/html-pages/article-page/construct-view-model';
import * as LOID from '../../../../src/types/list-owner-id';
import { createReadAndWriteSides, ReadAndWriteSides } from '../../../create-read-and-write-sides';
import { CommandHelpers, createCommandHelpers } from '../../../create-command-helpers';
import { arbitraryUserDetails } from '../../../types/user-details.helper';
import { ArticleServer } from '../../../../src/types/article-server';
import { toHtmlFragment } from '../../../../src/types/html-fragment';
import { sanitise } from '../../../../src/types/sanitised-html-fragment';
import { arbitraryString } from '../../../helpers';
import { List } from '../../../../src/types/list';

describe('construct-view-model', () => {
  let commandHandlers: ReadAndWriteSides['commandHandlers'];
  let getAllEvents: ReadAndWriteSides['getAllEvents'];
  let queries: ReadAndWriteSides['queries'];
  let commandHelpers: CommandHelpers;

  beforeEach(() => {
    ({ queries, getAllEvents, commandHandlers } = createReadAndWriteSides());
    commandHelpers = createCommandHelpers(commandHandlers);
  });

  describe('when the article is saved to a list', () => {
    const userDetails = arbitraryUserDetails();
    let list: List;
    const articleId = arbitraryArticleId();

    beforeEach(async () => {
      await commandHelpers.createUserAccount(userDetails);
      // eslint-disable-next-line prefer-destructuring
      list = queries.selectAllListsOwnedBy(LOID.fromUserId(userDetails.id))[0];
      await commandHelpers.addArticleToList(articleId, list.id);
    });

    it('list management has access to list id', async () => {
      const adapters: Ports = {
        ...queries,
        getAllEvents,
        fetchReview: () => TE.left('not-found'),
        findVersionsForArticleDoi: () => TO.none,
        fetchArticle: () => TE.right({
          doi: articleId,
          authors: O.none,
          title: sanitise(toHtmlFragment(arbitraryString())),
          abstract: sanitise(toHtmlFragment(arbitraryString())),
          server: 'biorxiv' as ArticleServer,
        }),
      };
      const viewModel = await pipe(
        {
          doi: articleId,
          user: O.some({ id: userDetails.id }),
        },
        constructViewModel(adapters),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(viewModel.userListManagement).toStrictEqual(O.some(expect.objectContaining({ listId: list.id })));
    });

    it.todo('list management has access to list name');

    it.todo('list management marks the article as being saved in the list');
  });
});
