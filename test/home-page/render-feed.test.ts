import { JSDOM } from 'jsdom';
import { Maybe } from 'true-myth';
import createRenderFeed, { GetEvents } from '../../src/home-page/render-feed';
import { RenderFeedItem } from '../../src/home-page/render-feed-item';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-feed', (): void => {
  it('returns a list', async (): Promise<void> => {
    const dummyGetEvents: GetEvents = async () => [
      {
        type: 'EditorialCommunityJoined',
        date: new Date(),
        editorialCommunityId: new EditorialCommunityId(''),
      },
    ];
    const dummyRenderFeedItem: RenderFeedItem = async () => '';
    const renderFeed = createRenderFeed(
      dummyGetEvents,
      dummyRenderFeedItem,
    );
    const rendered = JSDOM.fragment(await renderFeed(Maybe.nothing()));

    expect(rendered.querySelector('.ui.feed')?.tagName).toBe('OL');
  });

  describe('when given three feed items', () => {
    it.todo('renders the three feed items supplied');
  });
});
