import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import * as RFI from './review-feed-item.helper';
import { renderReviewFeedItem } from '../../../src/article-page/activity-page/render-review-feed-item';
import { missingFullTextAndSourceLink } from '../../../src/article-page/activity-page/static-messages';
import { reviewIdCodec } from '../../../src/types/review-id';
import { arbitraryNumber } from '../../helpers';
import * as t from '../../helpers';

describe('render-review-feed-item', () => {
  describe('when the review has long full text', () => {
    let rendered: DocumentFragment;
    const teaserLength = 6;
    const fullText = t.arbitraryTextLongerThan(teaserLength);
    const item = pipe(
      RFI.arbitrary(),
      RFI.withFullText(fullText),
    );

    beforeEach(() => {
      rendered = pipe(
        item,
        renderReviewFeedItem(teaserLength),
        JSDOM.fragment,
      );
    });

    it('renders the full text', async () => {
      const toggleableContent = rendered.querySelector('[data-behaviour="collapse_to_teaser"]');
      const fullTextWrapper = rendered.querySelector('[data-full-text]');
      const teaserWrapper = rendered.querySelector('[data-teaser]');

      expect(toggleableContent).not.toBeNull();
      expect(fullTextWrapper?.textContent).toStrictEqual(expect.stringContaining(fullText));
      expect(teaserWrapper?.textContent).toStrictEqual(expect.stringContaining('…'));
    });

    it('renders an id tag with the correct value', async () => {
      expect(rendered.getElementById(reviewIdCodec.encode(item.id))).not.toBeNull();
    });
  });

  describe('when the review has short full text', () => {
    const fullText = 'tldr';
    const source = 'http://example.com/source';
    const item = pipe(
      RFI.arbitrary(),
      RFI.withFullText(fullText),
      RFI.withSource(source),
    );
    let rendered: DocumentFragment;

    beforeEach(() => {
      rendered = pipe(
        item,
        renderReviewFeedItem(12),
        JSDOM.fragment,
      );
    });

    it('renders without a teaser', async () => {
      const toggleableContent = rendered.querySelector('[data-behaviour="collapse_to_teaser"]');
      const fullTextWrapper = rendered.querySelector('.activity-feed__item_body');
      const teaserWrapper = rendered.querySelector('[data-teaser]');
      const sourceLinkUrl = rendered.querySelector('.activity-feed__item__read_more')?.getAttribute('href');

      expect(toggleableContent).toBeNull();
      expect(teaserWrapper).toBeNull();
      expect(fullTextWrapper?.textContent).toStrictEqual(expect.stringContaining(fullText));
      expect(sourceLinkUrl).toStrictEqual(source);
    });

    it('renders an id tag with the correct value', async () => {
      expect(rendered.getElementById(reviewIdCodec.encode(item.id))).not.toBeNull();
    });
  });

  describe('when the review has no full text', () => {
    describe('when there is a source link URL', () => {
      const source = 'http://example.com/source';
      let rendered: DocumentFragment;
      const item = pipe(
        RFI.arbitrary(),
        RFI.withNoFullText,
        RFI.withSource(source),
      );

      beforeEach(() => {
        rendered = pipe(
          item,
          renderReviewFeedItem(6),
          JSDOM.fragment,
        );
      });

      it('renders without a teaser', async () => {
        const toggleableContent = rendered.querySelector('[data-behaviour="collapse_to_teaser"]');
        const sourceLinkUrl = rendered.querySelector('.activity-feed__item__read_more')?.getAttribute('href');

        expect(toggleableContent).toBeNull();
        expect(sourceLinkUrl).toStrictEqual(source);
      });

      it('renders an id tag with the correct value', async () => {
        expect(rendered.getElementById(reviewIdCodec.encode(item.id))).not.toBeNull();
      });
    });

    describe('when there is no source link URL', () => {
      let rendered: DocumentFragment;
      const item = pipe(
        RFI.arbitrary(),
        RFI.withNoFullText,
        RFI.withNoSource,
      );

      beforeEach(() => {
        rendered = pipe(
          item,
          renderReviewFeedItem(arbitraryNumber(6, 10)),
          JSDOM.fragment,
        );
      });

      it('displays a message that the evaluation is unavailable', () => {
        expect(rendered.textContent).toContain(missingFullTextAndSourceLink);
      });
    });
  });
});
