import { pipe } from 'fp-ts/function';
import { renderSummaryFeedList } from '../../src/shared-components';
import { Doi } from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';

describe('render-summary-feed-list', () => {
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

    expect(rendered).toStrictEqual(expect.stringContaining('<ol class="summary-feed-list"'));
  });
});
