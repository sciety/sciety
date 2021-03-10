import { URL } from 'url';
import * as T from 'fp-ts/Task';
import { mergeFeeds } from '../../src/article-page/merge-feeds';
import { Doi } from '../../src/types/doi';
import { GroupId } from '../../src/types/group-id';

describe('compose-feed-events', () => {
  it('merges feed event lists', async () => {
    const feed1 = () => T.of([
      {
        type: 'review',
        editorialCommunityId: new GroupId('communityId'),
        reviewId: new Doi('10.1234/5678'),
        occurredAt: new Date('2020-09-10'),
      },
    ] as const);
    const feed2 = () => T.of([
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

    const composite = mergeFeeds([feed1, feed2]);

    const feedEvents = await composite(new Doi('10.1101/2020.09.02.278911'))();

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
