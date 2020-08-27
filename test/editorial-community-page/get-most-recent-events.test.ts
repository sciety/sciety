import createGetMostRecentEvents, { GetAllEvents } from '../../src/editorial-community-page/get-most-recent-events';
import Doi from '../../src/types/doi';
import { DomainEvent } from '../../src/types/domain-events';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('get-most-recent-events', () => {
  const editorialCommunity1 = new EditorialCommunityId('1');
  const editorialCommunity2 = new EditorialCommunityId('2');
  const endorsedBy = (editorialCommunityId: EditorialCommunityId): DomainEvent => ({
    type: 'EditorialCommunityEndorsedArticle',
    date: new Date('2020-07-08'),
    editorialCommunityId,
    articleId: new Doi('10.1101/751099'),
  });

  it.todo('always returns EditorialCommunityJoined events');

  it('only returns events for the given editorial community', async () => {
    const allEvents: ReadonlyArray<DomainEvent> = [
      endorsedBy(editorialCommunity2),
      endorsedBy(editorialCommunity1),
      endorsedBy(editorialCommunity2),
    ];
    const getAllEvents: GetAllEvents = async () => allEvents;
    const getMostRecentEvents = createGetMostRecentEvents(getAllEvents, 20);
    const feed = await getMostRecentEvents(editorialCommunity1);

    expect(feed).toHaveLength(1);
    expect(feed[0]).toStrictEqual(allEvents[1]);
  });
});
