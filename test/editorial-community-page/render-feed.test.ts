import { Maybe } from 'true-myth';
import createRenderFeed, { GetEvents } from '../../src/editorial-community-page/render-feed';
import { RenderFollowToggle } from '../../src/editorial-community-page/render-follow-toggle';
import { RenderSummaryFeedList } from '../../src/templates/render-summary-feed-list';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render feed', () => {
  describe('with community events', () => {
    it.todo('returns a list of events');
  });

  describe('without community events', () => {
    it('returns fallback text', async () => {
      const getEvents: GetEvents<unknown> = async () => [];
      const renderFollowToggle: RenderFollowToggle = async () => '';
      const renderSummaryFeedList: RenderSummaryFeedList<unknown> = async () => Maybe.nothing();

      const renderFeed = createRenderFeed(getEvents, renderSummaryFeedList, renderFollowToggle);

      const rendered = await renderFeed(new EditorialCommunityId(''), Maybe.nothing());

      expect(rendered).toContain('community hasn’t evaluated');
    });
  });
});
