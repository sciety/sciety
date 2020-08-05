import createGetMostRecentEvents from '../../src/home-page/get-most-recent-events';
import Doi from '../../src/types/doi';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import { Event } from '../../src/types/events';
import { NonEmptyArray } from '../../src/types/non-empty-array';

describe('get-most-recent-events', () => {
  it('sorts by date descending', async () => {
    const initial: NonEmptyArray<Event> = [
      {
        type: 'ArticleEndorsed',
        date: new Date('2020-07-08'),
        actorId: new EditorialCommunityId(''),
        articleId: new Doi('10.1101/751099'),
      },
      {
        type: 'ArticleReviewed',
        date: new Date('2020-07-09'),
        actorId: new EditorialCommunityId(''),
        articleId: new Doi('10.1101/2020.01.22.915660'),
      },
    ];
    const getEvents = createGetMostRecentEvents(initial);
    const sortedEvents = await getEvents();

    expect(sortedEvents[0]).toStrictEqual(initial[1]);
    expect(sortedEvents[1]).toStrictEqual(initial[0]);
  });

  describe('when there\'s a small number of items', () => {
    it.todo('returns exactly those');
  });

  describe('when there are too many items to display', () => {
    it.todo('returns just N items');
  });
});
