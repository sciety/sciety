import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { articleAddedToListCard } from '../../../../src/html-pages/sciety-feed-page/construct-view-model/article-added-to-list-card';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import * as LOID from '../../../../src/types/list-owner-id';
import { createTestFramework, TestFramework } from '../../../framework';
import { List } from '../../../../src/read-models/lists';
import { ScietyFeedCard } from '../../../../src/html-pages/sciety-feed-page/view-model';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { constructEvent } from '../../../../src/domain-events';
import { Dependencies } from '../../../../src/html-pages/sciety-feed-page/construct-view-model';
import { arbitraryCreateListCommand } from '../../../write-side/commands/create-list-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../../write-side/commands/create-user-account-command.helper';

describe('article-added-to-list-card', () => {
  let framework: TestFramework;
  let dependencies: Dependencies;

  beforeEach(() => {
    framework = createTestFramework();
    dependencies = {
      ...framework.dependenciesForViews,
      getAllEvents: framework.getAllEvents,
    };
  });

  describe('when a user owns the list', () => {
    const createuserAccountCommand = arbitraryCreateUserAccountCommand();
    const date = new Date('2021-09-15');

    describe('when user details are available', () => {
      let userList: List;
      let viewModel: ScietyFeedCard;

      beforeEach(async () => {
        await framework.commandHelpers.createUserAccount(createuserAccountCommand);
        userList = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createuserAccountCommand.userId))[0];
        await framework.commandHelpers.addArticleToList(arbitraryArticleId(), userList.id);

        viewModel = pipe(
          constructEvent('ArticleAddedToList')({ articleId: arbitraryArticleId(), listId: userList.id, date }),
          articleAddedToListCard(dependencies),
          O.getOrElseW(shouldNotBeCalled),
        );
      });

      it('includes the user\'s handle in the title text', async () => {
        expect(viewModel.titleText).toContain(createuserAccountCommand.handle);
      });

      it('includes the user\'s avatar', async () => {
        expect(viewModel.avatarUrl).toStrictEqual(createuserAccountCommand.avatarUrl);
      });

      it('includes the event date', async () => {
        expect(viewModel.date).toStrictEqual(date);
      });

      it('includes the link to the list page', async () => {
        expect(viewModel.feedItemHref).toBe(`/lists/${userList.id}`);
      });
    });

    describe('when user details are not found', () => {
      const createListCommand = {
        ...arbitraryCreateListCommand(),
        ownerId: LOID.fromUserId(arbitraryUserId()),
      };
      let viewModel: ScietyFeedCard;

      beforeEach(async () => {
        await framework.commandHelpers.createList(createListCommand);
        viewModel = pipe(
          constructEvent('ArticleAddedToList')({ articleId: arbitraryArticleId(), listId: createListCommand.listId, date }),
          articleAddedToListCard(dependencies),
          O.getOrElseW(shouldNotBeCalled),
        );
      });

      it('replaces handle with "a user"', async () => {
        expect(viewModel.titleText).toMatch(/^A user/);
      });

      it('replaces avatar with a default image', async () => {
        expect(viewModel.avatarUrl).toBe('/static/images/sciety-logo.jpg');
      });

      it('includes the event date', async () => {
        expect(viewModel.date).toStrictEqual(date);
      });

      it('includes the link to the generic list page', async () => {
        expect(viewModel.feedItemHref).toBe(`/lists/${createListCommand.listId}`);
      });
    });
  });
});
