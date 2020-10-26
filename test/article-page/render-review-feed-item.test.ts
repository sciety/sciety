import { URL } from 'url';
import { JSDOM } from 'jsdom';
import { Maybe } from 'true-myth';
import createRenderReviewFeedItem from '../../src/article-page/render-review-feed-item';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-review-feed-item', () => {
  describe('when the review has long full text', () => {
    it('renders the full text', async () => {
      const fullText = 'A very long review';
      const renderReviewFeedItem = createRenderReviewFeedItem(6);

      const rendered = JSDOM.fragment(
        await renderReviewFeedItem({
          type: 'review',
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
    it('renders without a teaser', async () => {
      const fullText = 'tldr';
      const source = 'http://example.com/source';
      const renderReviewFeedItem = createRenderReviewFeedItem(12);

      const rendered = JSDOM.fragment(
        await renderReviewFeedItem({
          type: 'review',
          source: new URL(source),
          occurredAt: new Date(),
          editorialCommunityId: new EditorialCommunityId('community-1'),
          editorialCommunityName: 'Community 1',
          editorialCommunityAvatar: new URL('http://example.com/avatar'),
          fullText: Maybe.just(fullText),
        }),
      );
      const toggleableContent = rendered.querySelector('[data-behaviour="collapse_to_teaser"]');
      const fullTextWrapper = rendered.querySelector('.article-feed__item_body');
      const teaserWrapper = rendered.querySelector('[data-teaser]');
      const sourceLinkUrl = rendered.querySelector('.article-feed__item__read_more')?.getAttribute('href');

      expect(toggleableContent).toBeNull();
      expect(teaserWrapper).toBeNull();
      expect(fullTextWrapper?.textContent).toStrictEqual(expect.stringContaining(fullText));
      expect(sourceLinkUrl).toStrictEqual(source);
    });
  });

  describe('when the review has no full text', () => {
    it('renders without a teaser', async () => {
      const source = 'http://example.com/source';
      const renderReviewFeedItem = createRenderReviewFeedItem(6);

      const rendered = JSDOM.fragment(
        await renderReviewFeedItem({
          type: 'review',
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
