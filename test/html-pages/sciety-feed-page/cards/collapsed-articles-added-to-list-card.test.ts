import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { collapsedArticlesAddedToListCard, Ports } from '../../../../src/html-pages/sciety-feed-page/cards/collapsed-articles-added-to-list-card';
import { ScietyFeedCard } from '../../../../src/html-pages/sciety-feed-page/cards/sciety-feed-card';
import { dummyLogger } from '../../../dummy-logger';
import { arbitraryNumber, arbitraryString, arbitraryUri } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryGroup } from '../../../types/group.helper';
import { arbitraryList } from '../../../types/list-helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { LookupList } from '../../../../src/shared-ports';
import { arbitraryUserHandle } from '../../../types/user-handle.helper';

describe('collapsed-articles-added-to-list-card', () => {
  describe('when a group owns the list', () => {
    it.todo('write tests');
  });

  describe('when a user owns the list', () => {
    const date = new Date('2021-09-15');
    const listId = arbitraryListId();
    const articleCount = arbitraryNumber(2, 10);
    const event = {
      type: 'CollapsedArticlesAddedToList' as const,
      listId,
      date,
      articleCount,
    };

    const getAllEvents = T.of([]);
    const lookupList: LookupList = () => O.some({
      ...arbitraryList(),
      id: listId,
    });

    describe('when user details are available', () => {
      const avatarUrl = arbitraryUri();
      const handle = arbitraryUserHandle();
      const ports: Ports = {
        getAllEvents,
        lookupList,
        lookupUser: () => O.some({
          handle,
          avatarUrl,
          id: arbitraryUserId(),
          displayName: arbitraryString(),
        }),
        getGroup: () => O.some(arbitraryGroup()),
        logger: dummyLogger,
      };

      const viewModel: ScietyFeedCard = pipe(
        event,
        collapsedArticlesAddedToListCard(ports),
        O.getOrElseW(shouldNotBeCalled),
      );

      it('includes the user\'s handle in the title text', async () => {
        expect(viewModel.titleText).toContain(handle);
      });

      it('includes the user\'s avatar', async () => {
        expect(viewModel.avatarUrl).toStrictEqual(avatarUrl);
      });

      it('includes the event date', async () => {
        expect(viewModel.date).toStrictEqual(date);
      });

      it('includes the link to the list page', async () => {
        expect(viewModel.linkUrl).toBe(`/lists/${listId}`);
      });

      it('includes the article count', async () => {
        expect(viewModel.titleText).toContain(`${articleCount} articles`);
      });
    });

    describe('when user details are not found', () => {
      const ports: Ports = {
        getAllEvents,
        lookupList,
        lookupUser: () => O.none,
        getGroup: () => O.some(arbitraryGroup()),
        logger: dummyLogger,
      };

      const viewModel: ScietyFeedCard = pipe(
        event,
        collapsedArticlesAddedToListCard(ports),
        O.getOrElseW(shouldNotBeCalled),
      );

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
        expect(viewModel.linkUrl).toBe(`/lists/${listId}`);
      });

      it('includes the article count', async () => {
        expect(viewModel.titleText).toContain(`${articleCount} articles`);
      });
    });
  });
});
