import { pipe } from 'fp-ts/function';
import { renderFeed } from '../../src/group-page/render-feed';
import { Doi } from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';

describe('render feed', () => {
  describe('with group events', () => {
    it('renders a list of events', async () => {
      const rendered = renderFeed([
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

      expect(rendered).toStrictEqual(expect.stringContaining('reviewed'));
    });
  });

  describe('without group events', () => {
    it('renders fallback text', async () => {
      const rendered = renderFeed([]);

      expect(rendered).toStrictEqual(expect.stringContaining('group hasn’t evaluated'));
    });
  });
});
