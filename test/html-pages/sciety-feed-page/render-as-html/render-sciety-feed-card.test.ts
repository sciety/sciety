import { renderScietyFeedCard } from '../../../../src/html-pages/sciety-feed-page/render-as-html/render-sciety-feed-card';
import { toHtmlFragment } from '../../../../src/types/html-fragment';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../../../helpers';

describe('sciety-feed-card', () => {
  describe('when the view model doesn\'t contain details', () => {
    it('doesn\'t contain a details section', () => {
      const rendered = renderScietyFeedCard({
        titleText: arbitraryString(),
        avatarUrl: arbitraryUri(),
        date: arbitraryDate(),
        feedItemHref: arbitraryUri(),
      });

      expect(rendered).not.toContain('sciety-feed-card__details');
    });
  });

  describe('when the view model contains details', () => {
    it('contains a details section', () => {
      const rendered = renderScietyFeedCard({
        titleText: arbitraryString(),
        avatarUrl: arbitraryUri(),
        date: arbitraryDate(),
        feedItemHref: arbitraryUri(),
        details: {
          title: toHtmlFragment(arbitraryString()),
          content: toHtmlFragment(arbitraryString()),
        },
      });

      expect(rendered).toContain('sciety-feed-card__details');
    });
  });
});
