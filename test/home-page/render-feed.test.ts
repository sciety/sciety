import { JSDOM } from 'jsdom';
import { Maybe } from 'true-myth';
import createRenderFeed, { GetEvents } from '../../src/home-page/render-feed';
import { RenderFeedItem } from '../../src/home-page/render-feed-item';
import Doi from '../../src/types/doi';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import toUserId from '../../src/types/user-id';

describe('render-feed', (): void => {
  describe('when the user is logged in', () => {
    describe('and has a non-empty feed', () => {
      it('returns a list', async (): Promise<void> => {
        const dummyGetEvents: GetEvents = async () => [
          {
            type: 'EditorialCommunityEndorsedArticle',
            date: new Date(),
            editorialCommunityId: new EditorialCommunityId(''),
            articleId: new Doi('10.1101/12345678'),
          },
        ];
        const dummyRenderFeedItem: RenderFeedItem = async () => '';
        const renderFeed = createRenderFeed(
          dummyGetEvents,
          dummyRenderFeedItem,
        );
        const rendered = JSDOM.fragment(await renderFeed(Maybe.just(toUserId('1111'))));

        expect(rendered.querySelector('.ui.feed')?.tagName).toBe('OL');
      });

      describe('when given three feed items', () => {
        it.todo('renders the three feed items supplied');
      });
    });

    describe('and has an empty feed', () => {
      it('returns a come back later text', async (): Promise<void> => {
        const dummyGetEvents: GetEvents = async () => [];
        const dummyRenderFeedItem: RenderFeedItem = async () => '';
        const renderFeed = createRenderFeed(
          dummyGetEvents,
          dummyRenderFeedItem,
        );
        const rendered = JSDOM.fragment(await renderFeed(Maybe.just(toUserId('1111'))));

        expect(rendered.querySelector('.come-back-invitation')?.textContent).toStrictEqual(expect.stringContaining('come back any time'));
      });
    });

    describe('and is following nothing yet', () => {
    });
  });

  describe('when the user is not logged in', () => {
    it('invites them to log in', async () => {
      const dummyRenderFeedItem: RenderFeedItem = async () => '';
      const renderFeed = createRenderFeed(
        async () => [],
        dummyRenderFeedItem,
      );
      const rendered = JSDOM.fragment(await renderFeed(Maybe.nothing()));

      expect(rendered.querySelector('.log-in-invitation')?.textContent).toStrictEqual(expect.stringContaining('Log in to'));
    });
  });
});
