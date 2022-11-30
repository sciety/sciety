import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { articleAddedToList } from '../../../src/domain-events';
import { articleAddedToListCard } from '../../../src/sciety-feed-page/cards/article-added-to-list-card';
import { ScietyFeedCard } from '../../../src/sciety-feed-page/cards/sciety-feed-card';
import * as DE from '../../../src/types/data-error';
import { arbitraryString, arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryList } from '../../types/list-helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('article-added-to-list-card', () => {
  describe('when a group owns the list', () => {
    it.todo('write tests');
  });

  describe('when a user owns the list', () => {
    const date = new Date('2021-09-15');
    const listId = arbitraryListId();
    const event = articleAddedToList(arbitraryArticleId(), listId, date);
    const getAllEvents = T.of([]);
    const getList = () => O.some({
      ...arbitraryList(),
      listId,
    });

    describe('when user details are available', () => {
      const avatarUrl = arbitraryUri();
      const handle = 'handle';
      const ports = {
        getAllEvents,
        getList,
        getUserDetails: () => TE.right({
          handle,
          avatarUrl,
          userId: arbitraryUserId(),
          displayName: arbitraryString(),
        }),
        getGroup: () => E.right(arbitraryGroup()),
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

      it('includes the link to the generic list page', async () => {
        expect(viewModel.linkUrl).toBe(`/lists/${listId}`);
      });
    });

    describe('when user details are unavailable', () => {
      const failingGetUserDetails = () => TE.left(DE.unavailable);
      const ports = {
        getAllEvents,
        getList,
        getUserDetails: failingGetUserDetails,
        getGroup: () => E.right(arbitraryGroup()),
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

      it('includes the link to the generic list page', async () => {
        expect(viewModel.linkUrl).toBe(`/lists/${listId}`);
      });
    });
  });
});
