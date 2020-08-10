import createGetMostRecentEvents, { GetFollowList } from '../../src/home-page/get-most-recent-events';
import createFilterEvents from '../../src/infrastructure/filter-events';
import Doi from '../../src/types/doi';
import { DomainEvent } from '../../src/types/domain-events';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import FollowList from '../../src/types/follow-list';
import { NonEmptyArray } from '../../src/types/non-empty-array';

describe('get-most-recent-events', () => {
  const editorialCommunity1 = new EditorialCommunityId('a');
  const getFollowList: GetFollowList = async () => new FollowList([editorialCommunity1]);
  const dummyEvent: DomainEvent = {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-08'),
    actorId: editorialCommunity1,
    articleId: new Doi('10.1101/751099'),
  };

  it('sorts by date descending', async () => {
    const initial: NonEmptyArray<DomainEvent> = [
      {
        type: 'ArticleEndorsed',
        date: new Date('2020-07-08'),
        actorId: editorialCommunity1,
        articleId: new Doi('10.1101/751099'),
      },
      {
        type: 'ArticleReviewed',
        date: new Date('2020-07-09'),
        actorId: editorialCommunity1,
        articleId: new Doi('10.1101/2020.01.22.915660'),
      },
    ];
    const filterEvents = createFilterEvents(initial);
    const getEvents = createGetMostRecentEvents(getFollowList, filterEvents, 20);
    const sortedEvents = await getEvents(new FollowList([]));

    expect(sortedEvents[0]).toStrictEqual(initial[1]);
    expect(sortedEvents[1]).toStrictEqual(initial[0]);
  });

  it.todo('always returns EditorialCommunityJoined events');

  it.todo('only returns events for the follow list');

  describe('when there\'s a small number of items', () => {
    it('returns exactly those', async () => {
      const dummyEvents: NonEmptyArray<DomainEvent> = [dummyEvent, dummyEvent, dummyEvent];
      const filterEvents = createFilterEvents(dummyEvents);
      const getEvents = createGetMostRecentEvents(getFollowList, filterEvents, 20);
      const events = await getEvents(new FollowList([]));

      expect(events).toHaveLength(dummyEvents.length);
    });
  });

  describe('when there are more items than the specified maximum', () => {
    it('returns just the specified maximum number of items', async () => {
      const dummyEvents: NonEmptyArray<DomainEvent> = [dummyEvent, dummyEvent, dummyEvent];
      const maxCount = 2;
      const filterEvents = createFilterEvents(dummyEvents);
      const getEvents = createGetMostRecentEvents(getFollowList, filterEvents, maxCount);
      const events = await getEvents(new FollowList([]));

      expect(events).toHaveLength(maxCount);
    });
  });
});
