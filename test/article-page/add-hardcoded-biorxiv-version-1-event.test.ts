import { Result } from 'true-myth';
import createAddHardcodedBiorxivVersion1Event from '../../src/article-page/add-hardcoded-biorxiv-version-1-event';
import { GetFeedEvents } from '../../src/article-page/get-feed-events-content';
import Doi from '../../src/types/doi';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import shouldNotBeCalled from '../should-not-be-called';

describe('add-hardcoded-biorxiv-version-1-event', () => {
  it('adds a version 1 event to all articles', async () => {
    const decorator = createAddHardcodedBiorxivVersion1Event(
      async () => [],
      async () => Result.ok({
        publicationDate: new Date('2020-01-02'),
      }),
    );

    const feedEvents = await decorator(new Doi('10.1101/12345678'));

    expect(feedEvents[0]).toMatchObject({
      type: 'article-version',
      version: 1,
    });
  });

  describe('for article 10.1101/2020.09.02.278911', () => {
    it.skip('adds 2 version events', async () => {
      const getFeedEvents: GetFeedEvents = async () => [
        {
          type: 'review',
          editorialCommunityId: new EditorialCommunityId('communityId'),
          reviewId: new Doi('10.1234/5678'),
          occurredAt: new Date('2020-09-10'),
        },
      ];

      const decorator = createAddHardcodedBiorxivVersion1Event(
        getFeedEvents,
        shouldNotBeCalled,
      );

      const feedEvents = await decorator(new Doi('10.1101/2020.09.02.278911'));

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
});
