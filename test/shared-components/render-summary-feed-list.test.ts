import createRenderSummaryFeedList from '../../src/shared-components/render-summary-feed-list';
import { toHtmlFragment } from '../../src/types/html-fragment';
import shouldNotBeCalled from '../should-not-be-called';

describe('render-summary-feed-list', () => {
  describe('when there are events', () => {
    it('returns a list', async () => {
      const renderSummaryFeedList = createRenderSummaryFeedList(async () => toHtmlFragment(''));
      const events = [
        {}, {}, {},
      ];
      const rendered = await renderSummaryFeedList(events);

      expect(rendered.unsafelyUnwrap()).toStrictEqual(expect.stringContaining('<ol class="summary-feed-list"'));
    });
  });

  describe('when there are no events', () => {
    it('returns nothing', async () => {
      const renderSummaryFeedList = createRenderSummaryFeedList(shouldNotBeCalled);
      const rendered = await renderSummaryFeedList([]);

      expect(rendered.isNothing()).toBe(true);
    });
  });
});
