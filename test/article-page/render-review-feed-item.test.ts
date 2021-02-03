import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { createRenderReviewFeedItem } from '../../src/article-page/render-review-feed-item';
import { Doi } from '../../src/types/doi';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';

describe('render-review-feed-item', () => {
  describe('when the review has long full text', () => {
    let rendered: DocumentFragment;
    const fullText = 'A very long review';

    beforeEach(async () => {
      const renderReviewFeedItem = createRenderReviewFeedItem(6, () => T.of(toHtmlFragment('')));
      rendered = JSDOM.fragment(
        await renderReviewFeedItem({
          type: 'review',
          id: new Doi('10.1111/12345678'),
          source: new URL('http://example.com'),
          occurredAt: new Date(),
          editorialCommunityId: new EditorialCommunityId('community-1'),
          editorialCommunityName: 'Community 1',
          editorialCommunityAvatar: new URL('http://example.com/avatar'),
          fullText: pipe(fullText, toHtmlFragment, sanitise, O.some),
        }, O.none)(),
      );
    });

    it('renders the full text', async () => {
      const toggleableContent = rendered.querySelector('[data-behaviour="collapse_to_teaser"]');
      const fullTextWrapper = rendered.querySelector('[data-full-text]');
      const teaserWrapper = rendered.querySelector('[data-teaser]');

      expect(toggleableContent).not.toBeNull();
      expect(fullTextWrapper?.textContent).toStrictEqual(expect.stringContaining(fullText));
      expect(teaserWrapper?.textContent).toStrictEqual(expect.stringContaining('A …'));
    });

    it('renders an id tag with the correct value', async () => {
      expect(rendered.getElementById('doi:10.1111/12345678')).not.toBeNull();
    });
  });

  describe('when the review has short full text', () => {
    let rendered: DocumentFragment;
    const fullText = 'tldr';
    const source = 'http://example.com/source';

    beforeEach(async () => {
      const renderReviewFeedItem = createRenderReviewFeedItem(12, () => T.of(toHtmlFragment('')));

      rendered = JSDOM.fragment(
        await renderReviewFeedItem({
          type: 'review',
          id: new Doi('10.1111/12345678'),
          source: new URL(source),
          occurredAt: new Date(),
          editorialCommunityId: new EditorialCommunityId('community-1'),
          editorialCommunityName: 'Community 1',
          editorialCommunityAvatar: new URL('http://example.com/avatar'),
          fullText: pipe(fullText, toHtmlFragment, sanitise, O.some),
        }, O.none)(),
      );
    });

    it('renders without a teaser', async () => {
      const toggleableContent = rendered.querySelector('[data-behaviour="collapse_to_teaser"]');
      const fullTextWrapper = rendered.querySelector('.article-feed__item_body');
      const teaserWrapper = rendered.querySelector('[data-teaser]');
      const sourceLinkUrl = rendered.querySelector('.article-feed__item__read_more')?.getAttribute('href');

      expect(toggleableContent).toBeNull();
      expect(teaserWrapper).toBeNull();
      expect(fullTextWrapper?.textContent).toStrictEqual(expect.stringContaining(fullText));
      expect(sourceLinkUrl).toStrictEqual(source);
    });

    it('renders an id tag with the correct value', async () => {
      expect(rendered.getElementById('doi:10.1111/12345678')).not.toBeNull();
    });
  });

  describe('when the review has no full text', () => {
    const source = 'http://example.com/source';
    let rendered: DocumentFragment;

    beforeEach(async () => {
      const renderReviewFeedItem = createRenderReviewFeedItem(6, () => T.of(toHtmlFragment('')));

      rendered = JSDOM.fragment(
        await renderReviewFeedItem({
          type: 'review',
          id: new Doi('10.1111/12345678'),
          source: new URL(source),
          occurredAt: new Date(),
          editorialCommunityId: new EditorialCommunityId('community-1'),
          editorialCommunityName: 'Community 1',
          editorialCommunityAvatar: new URL('http://example.com/avatar'),
          fullText: O.none,
        }, O.none)(),
      );
    });

    it('renders without a teaser', async () => {
      const toggleableContent = rendered.querySelector('[data-behaviour="collapse_to_teaser"]');
      const sourceLinkUrl = rendered.querySelector('.article-feed__item__read_more')?.getAttribute('href');

      expect(toggleableContent).toBeNull();
      expect(sourceLinkUrl).toStrictEqual(source);
    });

    it('renders an id tag with the correct value', async () => {
      expect(rendered.getElementById('doi:10.1111/12345678')).not.toBeNull();
    });
  });
});
