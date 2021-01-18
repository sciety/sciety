import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import renderSummaryFeedList from '../../src/shared-components/render-summary-feed-list';
import { toHtmlFragment } from '../../src/types/html-fragment';
import shouldNotBeCalled from '../should-not-be-called';

describe('render-summary-feed-list', () => {
  describe('when there are events', () => {
    it('returns a list', async () => {
      const rendered = await pipe(
        [ {}, {}, {}, ],
        renderSummaryFeedList(() => T.of(toHtmlFragment(''))),
      )();

      expect(rendered).toStrictEqual(O.some(expect.stringContaining('<ol class="summary-feed-list"')));
    });
  });

  describe('when there are no events', () => {
    it('returns nothing', async () => {
      const rendered = await pipe(
        [],
        renderSummaryFeedList(shouldNotBeCalled),
      )();

      expect(rendered).toBe(O.none);
    });
  });
});
