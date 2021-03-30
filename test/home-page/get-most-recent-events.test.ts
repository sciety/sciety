import * as T from 'fp-ts/Task';
import { GetAllEvents, getMostRecentEvents } from '../../src/home-page/get-most-recent-events';
import { Doi } from '../../src/types/doi';
import { DomainEvent, editorialCommunityReviewedArticle } from '../../src/types/domain-events';
import { GroupId } from '../../src/types/group-id';
import { toUserId, UserId } from '../../src/types/user-id';

describe('get-most-recent-events', () => {
  const groupId1 = new GroupId('a');
  const dummyEvent: DomainEvent = editorialCommunityReviewedArticle(groupId1, new Doi('10.1101/751099'), new Doi('10.1234/8765'), new Date('2020-07-08'));

  it('reverse the order into date descending', async () => {
    const initial: ReadonlyArray<DomainEvent> = [
      editorialCommunityReviewedArticle(
        groupId1,
        new Doi('10.1101/751099'),
        new Doi('10.1234/5678'),
        new Date('2020-07-08'),
      ),
      editorialCommunityReviewedArticle(
        groupId1,
        new Doi('10.1101/2020.01.22.915660'),
        new Doi('10.1234/5678'),
        new Date('2020-07-09'),
      ),
    ];
    const getAllEvents: GetAllEvents = T.of(initial);
    const follows = () => T.of(true);
    const getEvents = getMostRecentEvents(getAllEvents, follows, 20);
    const sortedEvents = await getEvents(toUserId('user-1'))();

    expect(sortedEvents[0]).toStrictEqual(initial[1]);
    expect(sortedEvents[1]).toStrictEqual(initial[0]);
  });

  it('only returns events for the follow list', async () => {
    const initial: ReadonlyArray<DomainEvent> = [
      editorialCommunityReviewedArticle(
        groupId1,
        new Doi('10.1101/751099'),
        new Doi('10.1234/5678'),
        new Date('2020-07-08'),
      ),
      editorialCommunityReviewedArticle(
        new GroupId('b'),
        new Doi('10.1101/2020.01.22.915660'),
        new Doi('10.1234/5678'),
        new Date('2020-07-09'),
      ),
    ];
    const getAllEvents: GetAllEvents = T.of(initial);
    const follows = (_userId: UserId, groupId: GroupId) => T.of(groupId.toString() === 'b');
    const getEvents = getMostRecentEvents(getAllEvents, follows, 20);
    const sortedEvents = await getEvents(toUserId('user-1'))();

    expect(sortedEvents).toHaveLength(1);
    expect(sortedEvents[0]).toStrictEqual(initial[1]);
  });

  describe('when there\'s a small number of items', () => {
    it('returns exactly those', async () => {
      const dummyEvents: ReadonlyArray<DomainEvent> = [dummyEvent, dummyEvent, dummyEvent];
      const getAllEvents: GetAllEvents = T.of(dummyEvents);
      const follows = () => T.of(true);
      const getEvents = getMostRecentEvents(getAllEvents, follows, 20);
      const events = await getEvents(toUserId('user-1'))();

      expect(events).toHaveLength(dummyEvents.length);
    });
  });

  describe('when there are more items than the specified maximum', () => {
    it('returns just the specified maximum number of items', async () => {
      const dummyEvents: ReadonlyArray<DomainEvent> = [dummyEvent, dummyEvent, dummyEvent];
      const maxCount = 2;
      const getAllEvents: GetAllEvents = T.of(dummyEvents);
      const follows = () => T.of(true);
      const getEvents = getMostRecentEvents(getAllEvents, follows, maxCount);
      const events = await getEvents(toUserId('user-1'))();

      expect(events).toHaveLength(maxCount);
    });
  });
});
