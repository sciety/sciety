import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import { renderSummaryFeedList } from '../../src/shared-components/render-summary-feed-list';
import { Doi } from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';

describe('render-summary-feed-list', () => {
  describe('when there are feed items', () => {
    it('returns a list', async () => {
      const rendered = renderSummaryFeedList([
        {
          avatar: '',
          date: new Date(),
          actorName: '',
          actorUrl: '',
          doi: new Doi('10.1101/111111'),
          title: pipe('', toHtmlFragment, sanitise),
          verb: 'reviewed',
        },
      ]);

      expect(rendered).toStrictEqual(O.some(expect.stringContaining('<ol class="summary-feed-list"')));
    });
  });

  describe('when there are no feed items', () => {
    it('returns nothing', async () => {
      const rendered = renderSummaryFeedList([]);

      expect(rendered).toBe(O.none);
    });
  });
});
