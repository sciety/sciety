import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { renderFeed } from '../../src/article-page/render-feed';
import { Doi } from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { arbitraryGroupId } from '../types/group-id.helper';

describe('render-feed', () => {
  it('returns a list', () => {
    const feedItems = [
      {
        type: 'review',
        id: new Doi('10.1111/12345678'),
        source: O.some(new URL('http://example.com')),
        occurredAt: new Date(),
        groupId: arbitraryGroupId(),
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
