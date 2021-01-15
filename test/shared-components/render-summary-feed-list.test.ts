import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import createRenderSummaryFeedList from '../../src/shared-components/render-summary-feed-list';
import { toHtmlFragment } from '../../src/types/html-fragment';
import shouldNotBeCalled from '../should-not-be-called';

describe('render-summary-feed-list', () => {
  describe('when there are events', () => {
    it('returns a list', async () => {
      const renderSummaryFeedList = createRenderSummaryFeedList(() => T.of(toHtmlFragment('')));
      const events = [
        {}, {}, {},
      ];
      const rendered = await renderSummaryFeedList(events);

      expect(O.getOrElse(() => 'error')(rendered)).toStrictEqual(expect.stringContaining('<ol class="summary-feed-list"'));
    });
  });

  describe('when there are no events', () => {
    it('returns nothing', async () => {
      const renderSummaryFeedList = createRenderSummaryFeedList(shouldNotBeCalled);
      const rendered = await renderSummaryFeedList([]);

      expect(rendered).toBe(O.none);
    });
  });
});
