import { URL } from 'url';
import * as RT from 'fp-ts/ReaderTask';
import { mergeFeeds } from '../../src/article-page/merge-feeds';
import { Doi } from '../../src/types/doi';
import { arbitraryGroupId } from '../types/group-id.helper';

describe('merge-feeds', () => {
  it('merges feed event lists', async () => {
    const feed1 = RT.of([
      {
        type: 'review',
        groupId: arbitraryGroupId(),
        reviewId: new Doi('10.1234/5678'),
        occurredAt: new Date('2020-09-10'),
      },
    ] as const);
    const feed2 = RT.of([
      {
        type: 'article-version',
        source: new URL('https://www.biorxiv.org/content/10.1101/2020.09.02.278911v2'),
        occurredAt: new Date('2020-09-24'),
        version: 2,
      },
      {
        type: 'article-version',
        source: new URL('https://www.biorxiv.org/content/10.1101/2020.09.02.278911v1'),
        occurredAt: new Date('2020-09-03'),
        version: 1,
      },
    ] as const);

    const feedEvents = await mergeFeeds([feed1, feed2])({})();

    expect(feedEvents[0]).toMatchObject({
      type: 'article-version',
      version: 2,
    });
    expect(feedEvents[1]).toMatchObject({
      type: 'review',
    });
    expect(feedEvents[2]).toMatchObject({
      type: 'article-version',
      version: 1,
    });
  });
});
