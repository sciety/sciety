import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as LOID from '../../../../src/types/list-owner-id';
import { collapsedArticlesAddedToListCard } from '../../../../src/html-pages/sciety-feed-page/construct-view-model/collapsed-articles-added-to-list-card';
import { arbitraryDate, arbitraryNumber } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { ScietyFeedCard } from '../../../../src/html-pages/sciety-feed-page/view-model';
import { createTestFramework, TestFramework } from '../../../framework';
import { List } from '../../../../src/read-models/lists';
import { Dependencies } from '../../../../src/html-pages/sciety-feed-page/construct-view-model';
import { arbitraryCreateListCommand } from '../../../write-side/commands/create-list-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../../write-side/commands/create-user-account-command.helper';

describe('collapsed-articles-added-to-list-card', () => {
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
    const date = arbitraryDate();
    const articleCount = arbitraryNumber(2, 10);

    describe('when user details are available', () => {
      const createUserAccountCommand = arbitraryCreateUserAccountCommand();
      let list: List;
      let viewModel: ScietyFeedCard;

      beforeEach(async () => {
        await framework.commandHelpers.createUserAccount(createUserAccountCommand);
        list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
        viewModel = pipe(
          {
            type: 'CollapsedArticlesAddedToList' as const,
            listId: list.id,
            date,
            articleCount,
          },
          collapsedArticlesAddedToListCard(dependencies),
          O.getOrElseW(shouldNotBeCalled),
        );
      });

      it('includes the user\'s handle in the title text', async () => {
        expect(viewModel.titleText).toContain(createUserAccountCommand.handle);
      });

      it('includes the user\'s avatar', async () => {
        expect(viewModel.avatarSrc).toContain(createUserAccountCommand.handle);
      });

      it('includes the event date', async () => {
        expect(viewModel.date).toStrictEqual(date);
      });

      it('includes the link to the list page', async () => {
        expect(viewModel.feedItemHref).toBe(`/lists/${list.id}`);
      });

      it('includes the article count', async () => {
        expect(viewModel.titleText).toContain(`${articleCount} articles`);
      });
    });

    describe('when user details are not found', () => {
      const createListCommand = {
        ...arbitraryCreateListCommand(),
        ownerId: LOID.fromUserId(arbitraryUserId()),
      };
      const event = {
        type: 'CollapsedArticlesAddedToList' as const,
        listId: createListCommand.listId,
        date,
        articleCount,
      };
      let viewModel: ScietyFeedCard;

      beforeEach(async () => {
        await framework.commandHelpers.createList(createListCommand);
        viewModel = pipe(
          event,
          collapsedArticlesAddedToListCard(dependencies),
          O.getOrElseW(shouldNotBeCalled),
        );
      });

      it('replaces handle with "a user"', async () => {
        expect(viewModel.titleText).toMatch(/^A user/);
      });

      it('replaces avatar with a default image', async () => {
        expect(viewModel.avatarSrc).toBe('/static/images/sciety-logo.jpg');
      });

      it('includes the event date', async () => {
        expect(viewModel.date).toStrictEqual(date);
      });

      it('includes the link to the list page', async () => {
        expect(viewModel.feedItemHref).toBe(`/lists/${createListCommand.listId}`);
      });

      it('includes the article count', async () => {
        expect(viewModel.titleText).toContain(`${articleCount} articles`);
      });
    });
  });
});
