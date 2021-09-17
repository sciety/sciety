import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { renderFeed } from '../../../src/article-page/activity-page/render-feed';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { arbitraryWord } from '../../helpers';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('render-feed', () => {
  it('returns a list', () => {
    const feedItems = [
      {
        type: 'review',
        id: arbitraryReviewId(),
        source: O.some(new URL('http://example.com')),
        occurredAt: new Date(),
        groupSlug: arbitraryWord(),
        groupName: '',
        groupAvatar: '/images/xyz.png',
        fullText: O.none,
        counts: {
          helpfulCount: 0,
          notHelpfulCount: 0,
        },
        current: O.none,
      },
      {
        type: 'article-version',
        source: new URL('http://example.com'),
        occurredAt: new Date(),
        version: 1,
        server: 'biorxiv',
      },
      {
        type: 'article-version-error',
        server: 'biorxiv',
      },
    ] as const;

    const rendered = renderFeed(() => toHtmlFragment(''))(feedItems);

    expect(rendered).toContain('<ol');
  });
});
