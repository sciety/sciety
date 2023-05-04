import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CandidateUserHandle } from '../../../../../src/types/candidate-user-handle';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { TestFramework, createTestFramework } from '../../../../framework';
import * as LOID from '../../../../../src/types/list-owner-id';
import { List } from '../../../../../src/types/list';
import { arbitraryList } from '../../../../types/list-helper';
import { arbitraryUserDetails } from '../../../../types/user-details.helper';
import { constructViewModel } from '../../../../../src/html-pages/user-page/user-lists-page/construct-view-model';
import { ViewModel } from '../../../../../src/html-pages/user-page/user-lists-page/view-model';
import { arbitraryArticleId } from '../../../../types/article-id.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let viewmodel: ViewModel;
  const user = arbitraryUserDetails();
  const pageParams = {
    handle: user.handle as string as CandidateUserHandle,
    user: O.none,
  };

  beforeEach(async () => {
    framework = createTestFramework();
    await framework.commandHelpers.createUserAccount(user);
  });

  describe('when the user owns two lists', () => {
    let initialUserList: List;
    const updatedList = arbitraryList(LOID.fromUserId(user.id));

    beforeEach(async () => {
      initialUserList = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(user.id))[0];
      await framework.commandHelpers.createList(updatedList);
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), updatedList.id);
    });

    describe('and the lists tab is selected', () => {
      beforeEach(async () => {
        viewmodel = await pipe(
          pageParams,
          constructViewModel(framework.queries),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('the list count is 2', async () => {
        expect(viewmodel.listCount).toBe(2);
      });

      it('two list cards are displayed', () => {
        expect(viewmodel.ownedLists).toHaveLength(2);
      });

      it('the most recently updated list is shown first', async () => {
        expect(viewmodel).toStrictEqual(expect.objectContaining({
          ownedLists: [
            expect.objectContaining({ listId: updatedList.id }),
            expect.objectContaining({ listId: initialUserList.id }),
          ],
        }));
      });
    });
  });

  describe('when the user saves an article to the default list for the first time', () => {
    beforeEach(async () => {
      const list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(user.id))[0];
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), list.id);
    });

    it('the article count of the default list is 1', async () => {
      viewmodel = await pipe(
        pageParams,
        constructViewModel(framework.queries),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(viewmodel).toStrictEqual(expect.objectContaining({
        ownedLists: [expect.objectContaining({
          articleCount: 1,
        })],
      }));
    });
  });

  describe('use details', () => {
    beforeEach(async () => {
      viewmodel = await pipe(
        pageParams,
        constructViewModel(framework.queries),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('exposes the user details', async () => {
      expect(viewmodel.userDetails.handle).toBe(user.handle);
      expect(viewmodel.userDetails.displayName).toBe(user.displayName);
      expect(viewmodel.userDetails.avatarUrl).toBe(user.avatarUrl);
    });
  });
});
