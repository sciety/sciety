import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as LOID from '../../../../src/types/list-owner-id';
import { collapsedArticlesAddedToListCard } from '../../../../src/html-pages/sciety-feed-page/construct-view-model/collapsed-articles-added-to-list-card';
import { arbitraryDate, arbitraryNumber } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryList } from '../../../types/list-helper';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { ScietyFeedCard } from '../../../../src/html-pages/sciety-feed-page/view-model';
import { createTestFramework, TestFramework } from '../../../framework';
import { arbitraryUserDetails } from '../../../types/user-details.helper';
import { List } from '../../../../src/types/list';

describe('collapsed-articles-added-to-list-card', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when a group owns the list', () => {
    it.todo('write tests');
  });

  describe('when a user owns the list', () => {
    const date = arbitraryDate();
    const articleCount = arbitraryNumber(2, 10);

    describe('when user details are available', () => {
      const user = arbitraryUserDetails();
      let list: List;
      let viewModel: ScietyFeedCard;

      beforeEach(async () => {
        await framework.commandHelpers.createUserAccount(user);
        list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(user.id))[0];
        viewModel = pipe(
          {
            type: 'CollapsedArticlesAddedToList' as const,
            listId: list.id,
            date,
            articleCount,
          },
          collapsedArticlesAddedToListCard(framework.dependenciesForViews),
          O.getOrElseW(shouldNotBeCalled),
        );
      });

      it('includes the user\'s handle in the title text', async () => {
        expect(viewModel.titleText).toContain(user.handle);
      });

      it('includes the user\'s avatar', async () => {
        expect(viewModel.avatarUrl).toStrictEqual(user.avatarUrl);
      });

      it('includes the event date', async () => {
        expect(viewModel.date).toStrictEqual(date);
      });

      it('includes the link to the list page', async () => {
        expect(viewModel.linkUrl).toBe(`/lists/${list.id}`);
      });

      it('includes the article count', async () => {
        expect(viewModel.titleText).toContain(`${articleCount} articles`);
      });
    });

    describe('when user details are not found', () => {
      const list = arbitraryList(LOID.fromUserId(arbitraryUserId()));
      const event = {
        type: 'CollapsedArticlesAddedToList' as const,
        listId: list.id,
        date,
        articleCount,
      };
      let viewModel: ScietyFeedCard;

      beforeEach(async () => {
        await framework.commandHelpers.createList(list);
        viewModel = pipe(
          event,
          collapsedArticlesAddedToListCard(framework.dependenciesForViews),
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

      it('includes the link to the list page', async () => {
        expect(viewModel.linkUrl).toBe(`/lists/${list.id}`);
      });

      it('includes the article count', async () => {
        expect(viewModel.titleText).toContain(`${articleCount} articles`);
      });
    });
  });
});
