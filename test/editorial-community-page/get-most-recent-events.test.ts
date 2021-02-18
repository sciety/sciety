import * as T from 'fp-ts/Task';
import { GetAllEvents, getMostRecentEvents } from '../../src/editorial-community-page/get-most-recent-events';
import { Doi } from '../../src/types/doi';
import { DomainEvent, editorialCommunityReviewedArticle } from '../../src/types/domain-events';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { toReviewId } from '../../src/types/review-id';

describe('get-most-recent-events', () => {
  const editorialCommunity1 = new EditorialCommunityId('1');
  const editorialCommunity2 = new EditorialCommunityId('2');

  it('only returns events for the given editorial community', async () => {
    const allEvents: ReadonlyArray<DomainEvent> = [
      editorialCommunityReviewedArticle(editorialCommunity2, new Doi('10.1101/123456'), toReviewId('hypothesis:reviewA')),
      editorialCommunityReviewedArticle(editorialCommunity1, new Doi('10.1101/123456'), toReviewId('hypothesis:reviewB')),
      editorialCommunityReviewedArticle(editorialCommunity2, new Doi('10.1101/123456'), toReviewId('hypothesis:reviewC')),
    ];
    const getAllEvents: GetAllEvents = T.of(allEvents);
    const feed = await getMostRecentEvents(getAllEvents, 20)(editorialCommunity1)();

    expect(feed).toHaveLength(1);
    expect(feed[0]).toStrictEqual(allEvents[1]);
  });
});
