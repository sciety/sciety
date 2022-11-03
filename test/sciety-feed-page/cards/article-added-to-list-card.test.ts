import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { articleAddedToList } from '../../../src/domain-events';
import { listCreated } from '../../../src/domain-events/list-created-event';
import { articleAddedToListCard } from '../../../src/sciety-feed-page/cards/article-added-to-list-card';
import { ScietyFeedCard } from '../../../src/sciety-feed-page/cards/sciety-feed-card';
import * as DE from '../../../src/types/data-error';
import * as LOID from '../../../src/types/list-owner-id';
import { arbitraryString, arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('article-added-to-list-card', () => {
  describe('when a group owns the list', () => {
    it.todo('write tests');
  });

  describe('when a user owns the list', () => {
    const userId = arbitraryUserId();
    const date = new Date('2021-09-15');
    const listId = arbitraryListId();
    const event = articleAddedToList(arbitraryArticleId(), listId, date);
    const getAllEvents = T.of([
      listCreated(
        listId,
        arbitraryString(),
        arbitraryString(),
        LOID.fromUserId(userId),
      ),
    ]);

    describe('when user details are available', () => {
      const avatarUrl = arbitraryUri();
      const handle = 'handle';
      const ports = {
        getAllEvents,
        getUserDetails: () => TE.right({
          handle,
          avatarUrl,
          userId: arbitraryUserId(),
          displayName: arbitraryString(),
        }),
      };

      let viewModel: ScietyFeedCard;

      beforeEach(async () => {
        viewModel = await pipe(
          event,
          articleAddedToListCard(ports),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('includes the user\'s handle in the title text', async () => {
        expect(viewModel.titleText).toContain(handle);
      });

      it('includes the user\'s avatar', async () => {
        expect(viewModel.avatarUrl).toStrictEqual(avatarUrl);
      });

      it('includes the event date', async () => {
        expect(viewModel.date).toStrictEqual(date);
      });

      it('includes the link to the user list page because the generic list page is not releasable yet', async () => {
        expect(viewModel.linkUrl).toBe(`/users/${handle}/lists/saved-articles`);
      });
    });

    describe('when user details are unavailable', () => {
      const failingGetUserDetails = () => TE.left(DE.unavailable);
      const ports = {
        getAllEvents,
        getUserDetails: failingGetUserDetails,
      };

      let viewModel: ScietyFeedCard;

      beforeEach(async () => {
        viewModel = await pipe(
          event,
          articleAddedToListCard(ports),
          TE.getOrElse(shouldNotBeCalled),
        )();
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

      it('includes the link to the user list page because the generic list page is not releasable yet', async () => {
        expect(viewModel.linkUrl).toBe(`/users/${userId}/lists/saved-articles`);
      });
    });
  });
});
