import { Maybe } from 'true-myth';
import createRenderFeed, { GetEvents } from '../../src/editorial-community-page/render-feed';
import { RenderFollowToggle } from '../../src/editorial-community-page/render-follow-toggle';
import { RenderSummaryFeedList } from '../../src/templates/render-summary-feed-list';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render feed', () => {
  const stubGetEvents: GetEvents<unknown> = async () => [];
  const stubRenderFollowToggle: RenderFollowToggle = async () => '';
  const anEditorialCommunityId = new EditorialCommunityId('');
  const aUserId = Maybe.nothing<never>();

  describe('with community events', () => {
    it('returns a list of events', async () => {
      const renderSummaryFeedList: RenderSummaryFeedList<unknown> = async () => Maybe.just('a list');

      const renderFeed = createRenderFeed(stubGetEvents, renderSummaryFeedList, stubRenderFollowToggle);

      const rendered = await renderFeed(anEditorialCommunityId, aUserId);

      expect(rendered).toContain('a list');
    });
  });

  describe('without community events', () => {
    it('returns fallback text', async () => {
      const renderSummaryFeedList: RenderSummaryFeedList<unknown> = async () => Maybe.nothing();

      const renderFeed = createRenderFeed(stubGetEvents, renderSummaryFeedList, stubRenderFollowToggle);

      const rendered = await renderFeed(anEditorialCommunityId, aUserId);

      expect(rendered).toContain('community hasn’t evaluated');
    });
  });
});
