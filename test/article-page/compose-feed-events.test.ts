import { URL } from 'url';
import { composeFeedEvents } from '../../src/article-page/compose-feed-events';
import { GetFeedEvents } from '../../src/article-page/get-feed-events-content';
import { Doi } from '../../src/types/doi';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';

describe('compose-feed-events', () => {
  it('merges feed event lists', async () => {
    const getFeedEvents1: GetFeedEvents = async () => [
      {
        type: 'review',
        editorialCommunityId: new EditorialCommunityId('communityId'),
        reviewId: new Doi('10.1234/5678'),
        occurredAt: new Date('2020-09-10'),
      },
    ];
    const getFeedEvents2: GetFeedEvents = async () => [
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
    ];

    const composite = composeFeedEvents(
      getFeedEvents1,
      getFeedEvents2,
    );

    const feedEvents = await composite(new Doi('10.1101/2020.09.02.278911'));

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
