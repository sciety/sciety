import { URL } from 'url';
import { JSDOM } from 'jsdom';
import { Maybe } from 'true-myth';
import createRenderReviewedEvent from '../../src/article-page/render-reviewed-event';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-reviewed-event', () => {
  describe('when the review has full text', () => {
    it('renders the full text', () => {
      const fullText = 'A very long review';
      const renderReviewedEvent = createRenderReviewedEvent(6);

      const rendered = JSDOM.fragment(
        renderReviewedEvent({
          source: new URL('http://example.com'),
          occurredAt: new Date(),
          editorialCommunityId: new EditorialCommunityId('community-1'),
          editorialCommunityName: 'Community 1',
          editorialCommunityAvatar: new URL('http://example.com/avatar'),
          fullText: Maybe.just(fullText),
        }),
      );
      const fullTextWrapper = rendered.querySelector('[data-full-text]');

      expect(fullTextWrapper?.textContent).toStrictEqual(expect.stringContaining(fullText));
    });
  });

  describe('when the review has no full text', () => {
    it.todo('renders without a teaser');
  });
});
