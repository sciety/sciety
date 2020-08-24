import { JSDOM } from 'jsdom';
import createRenderFeed, { GetEvents, GetFollows } from '../../src/home-page/render-feed';
import { RenderFeedItem } from '../../src/home-page/render-feed-item';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import userId from '../../src/types/user-id';

describe('render-feed', (): void => {
  it('returns a list', async (): Promise<void> => {
    const dummyGetFollows: GetFollows = async () => () => false;
    const dummyGetEvents: GetEvents = async () => [
      {
        type: 'EditorialCommunityJoined',
        date: new Date(),
        editorialCommunityId: new EditorialCommunityId(''),
      },
    ];
    const dummyRenderFeedItem: RenderFeedItem = async () => '';
    const renderFeed = createRenderFeed(
      dummyGetFollows,
      dummyGetEvents,
      dummyRenderFeedItem,
    );
    const rendered = JSDOM.fragment(await renderFeed(userId('user-1')));

    expect(rendered.querySelector('.ui.feed')?.tagName).toBe('OL');
  });

  describe('when given three feed items', () => {
    it.todo('renders the three feed items supplied');
  });
});
