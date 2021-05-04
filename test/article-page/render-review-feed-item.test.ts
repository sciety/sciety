import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { renderReviewFeedItem, ReviewFeedItem } from '../../src/article-page/render-review-feed-item';
import { Doi } from '../../src/types/doi';
import { GroupId } from '../../src/types/group-id';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';

const arbitraryDoi = () => new Doi('10.1101/arbitrary.doi.1');

const arbitraryString = () => 'Lorem ipsum';

const arbitraryTextLongerThan = (min: number) => 'xy '.repeat(min);

const arbitraryReviewFeedItem = (articleId: Doi, source = 'http://example.com'): ReviewFeedItem => ({
  type: 'review',
  id: articleId,
  source: O.some(new URL(source)),
  occurredAt: new Date(),
  groupId: new GroupId('group-1'),
  groupName: 'group 1',
  groupAvatar: '/avatar',
  fullText: pipe(arbitraryString(), toHtmlFragment, sanitise, O.some),
  counts: {
    helpfulCount: 0,
    notHelpfulCount: 0,
  },
  current: O.none,
});

const withFullText = (fullText: string) => (rfi: ReviewFeedItem): ReviewFeedItem => ({
  ...rfi,
  fullText: pipe(fullText, toHtmlFragment, sanitise, O.some),
});

describe('render-review-feed-item', () => {
  describe('when the review has long full text', () => {
    let rendered: DocumentFragment;
    const teaserLength = 6;
    const fullText = arbitraryTextLongerThan(teaserLength);
    const articleId = arbitraryDoi();

    beforeEach(() => {
      rendered = pipe(
        arbitraryReviewFeedItem(articleId),
        withFullText(fullText),
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
      expect(rendered.getElementById(`doi:${articleId.value}`)).not.toBeNull();
    });
  });

  describe('when the review has short full text', () => {
    let rendered: DocumentFragment;
    const fullText = 'tldr';
    const source = 'http://example.com/source';
    const articleId = arbitraryDoi();

    beforeEach(() => {
      rendered = pipe(
        arbitraryReviewFeedItem(articleId, source),
        withFullText(fullText),
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
      expect(rendered.getElementById(`doi:${articleId.value}`)).not.toBeNull();
    });
  });

  describe('when the review has no full text', () => {
    const source = 'http://example.com/source';
    let rendered: DocumentFragment;
    const articleId = arbitraryDoi();

    beforeEach(() => {
      rendered = pipe(
        {
          type: 'review',
          id: articleId,
          source: O.some(new URL(source)),
          occurredAt: new Date(),
          groupId: new GroupId('group-1'),
          groupName: 'group 1',
          groupAvatar: '/avatar',
          fullText: O.none,
          counts: {
            helpfulCount: 0,
            notHelpfulCount: 0,
          },
          current: O.none,
        },
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
      expect(rendered.getElementById(`doi:${articleId.value}`)).not.toBeNull();
    });
  });
});
