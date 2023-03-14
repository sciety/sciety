import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { UserDetails } from '../../../../src/types/user-details';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { constructViewModel, Ports } from '../../../../src/html-pages/article-page/construct-view-model';
import { ViewModel } from '../../../../src/html-pages/article-page/view-model';
import * as LOID from '../../../../src/types/list-owner-id';
import { arbitraryUserDetails } from '../../../types/user-details.helper';
import { List } from '../../../../src/types/list';
import { arbitraryList } from '../../../types/list-helper';
import { createTestFramework, TestFramework } from '../../../framework';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let adapters: Ports;
  const articleId = arbitraryArticleId();

  beforeEach(() => {
    framework = createTestFramework();
    adapters = {
      ...framework.queries,
      ...framework.happyPathThirdParties,
      getAllEvents: framework.getAllEvents,
    };
  });

  describe('when the user is logged in', () => {
    let userDetails: UserDetails;

    beforeEach(async () => {
      userDetails = arbitraryUserDetails();
      await framework.commandHelpers.createUserAccount(userDetails);
    });

    describe('when the article is not saved to any user list', () => {
      let list: List;
      let viewModel: ViewModel;

      beforeEach(async () => {
        // eslint-disable-next-line prefer-destructuring
        list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(userDetails.id))[0];
        viewModel = await pipe(
          {
            doi: articleId,
            user: O.some({ id: userDetails.id }),
          },
          constructViewModel(adapters),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('list management has access to the default user list id', () => {
        expect(viewModel.userListManagement).toStrictEqual(O.some(expect.objectContaining({ listId: list.id })));
      });

      it('list management has access to the default user list name', () => {
        expect(viewModel.userListManagement).toStrictEqual(O.some(expect.objectContaining({ listName: list.name })));
      });

      it('list management marks the article as not being saved in the default user list', () => {
        expect(viewModel.userListManagement).toStrictEqual(O.some(expect.objectContaining({ isArticleInList: false })));
      });
    });

    describe('when the article is saved to the default user list', () => {
      let list: List;
      let viewModel: ViewModel;

      beforeEach(async () => {
        // eslint-disable-next-line prefer-destructuring
        list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(userDetails.id))[0];
        await framework.commandHelpers.addArticleToList(articleId, list.id);
        viewModel = await pipe(
          {
            doi: articleId,
            user: O.some({ id: userDetails.id }),
          },
          constructViewModel(adapters),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('list management has access to list id', async () => {
        expect(viewModel.userListManagement).toStrictEqual(O.some(expect.objectContaining({ listId: list.id })));
      });

      it('list management has access to list name', () => {
        expect(viewModel.userListManagement).toStrictEqual(O.some(expect.objectContaining({ listName: list.name })));
      });

      it('list management marks the article as being saved in the list', () => {
        expect(viewModel.userListManagement).toStrictEqual(O.some(expect.objectContaining({ isArticleInList: true })));
      });
    });

    describe('when the article is saved to another user list', () => {
      let list: List;
      let viewModel: ViewModel;

      beforeEach(async () => {
        list = { ...arbitraryList(), ownerId: LOID.fromUserId(userDetails.id) };
        await framework.commandHelpers.createList(list);
        await framework.commandHelpers.addArticleToList(articleId, list.id);
        viewModel = await pipe(
          {
            doi: articleId,
            user: O.some({ id: userDetails.id }),
          },
          constructViewModel(adapters),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('list management has access to list id', () => {
        expect(viewModel.userListManagement).toStrictEqual(O.some(expect.objectContaining({ listId: list.id })));
      });

      it('list management has access to list name', () => {
        expect(viewModel.userListManagement).toStrictEqual(O.some(expect.objectContaining({ listName: list.name })));
      });

      it('list management marks the article as being saved in the list', () => {
        expect(viewModel.userListManagement).toStrictEqual(O.some(expect.objectContaining({ isArticleInList: true })));
      });
    });
  });
});
