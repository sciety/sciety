import * as T from 'fp-ts/Task';
import { createGetMostRecentEvents, GetAllEvents } from '../../src/editorial-community-page/get-most-recent-events';
import { Doi } from '../../src/types/doi';
import { DomainEvent, editorialCommunityReviewedArticle } from '../../src/types/domain-events';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { toReviewId } from '../../src/types/review-id';

describe('get-most-recent-events', () => {
  const editorialCommunity1 = new EditorialCommunityId('1');
  const editorialCommunity2 = new EditorialCommunityId('2');

  it('only returns events for the given editorial community', async () => {
    const allEvents: ReadonlyArray<DomainEvent> = [
      editorialCommunityReviewedArticle(editorialCommunity2, new Doi('10.1101/123456'), toReviewId('reviewA')),
      editorialCommunityReviewedArticle(editorialCommunity1, new Doi('10.1101/123456'), toReviewId('reviewB')),
      editorialCommunityReviewedArticle(editorialCommunity2, new Doi('10.1101/123456'), toReviewId('reviewC')),
    ];
    const getAllEvents: GetAllEvents = T.of(allEvents);
    const getMostRecentEvents = createGetMostRecentEvents(getAllEvents, 20);
    const feed = await getMostRecentEvents(editorialCommunity1)();

    expect(feed).toHaveLength(1);
    expect(feed[0]).toStrictEqual(allEvents[1]);
  });
});
