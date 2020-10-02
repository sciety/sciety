import { URL } from 'url';
import { JSDOM } from 'jsdom';
import { Maybe } from 'true-myth';
import createRenderReviewedEvent from '../../src/article-page/render-reviewed-event';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-reviewed-event', () => {
  describe('when the review has long full text', () => {
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
      const toggleableContent = rendered.querySelector('[data-behaviour="collapse_to_teaser"]');
      const fullTextWrapper = rendered.querySelector('[data-full-text]');
      const teaserWrapper = rendered.querySelector('[data-teaser]');

      expect(toggleableContent).not.toBeNull();
      expect(fullTextWrapper?.textContent).toStrictEqual(expect.stringContaining(fullText));
      expect(teaserWrapper?.textContent).toStrictEqual(expect.stringContaining('A …'));
    });
  });

  describe('when the review has short full text', () => {
    it.todo('renders without a teaser');
  });

  describe('when the review has no full text', () => {
    it('renders without a teaser', () => {
      const source = 'http://example.com/source';
      const renderReviewedEvent = createRenderReviewedEvent(6);

      const rendered = JSDOM.fragment(
        renderReviewedEvent({
          source: new URL(source),
          occurredAt: new Date(),
          editorialCommunityId: new EditorialCommunityId('community-1'),
          editorialCommunityName: 'Community 1',
          editorialCommunityAvatar: new URL('http://example.com/avatar'),
          fullText: Maybe.nothing(),
        }),
      );
      const toggleableContent = rendered.querySelector('[data-behaviour="collapse_to_teaser"]');
      const sourceLinkUrl = rendered.querySelector('.article-feed__item__read_more')?.getAttribute('href');

      expect(toggleableContent).toBeNull();
      expect(sourceLinkUrl).toStrictEqual(source);
    });
  });
});
