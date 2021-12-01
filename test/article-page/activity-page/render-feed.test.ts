import { URL } from 'url';
import * as RFI from './review-feed-item.helper';
import { renderFeed } from '../../../src/article-page/activity-page/render-feed';
import { toHtmlFragment } from '../../../src/types/html-fragment';

describe('render-feed', () => {
  it('returns a list', () => {
    const feedItems = [
      RFI.arbitrary(),
      {
        type: 'article-version',
        source: new URL('http://example.com'),
        publishedAt: new Date(),
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
