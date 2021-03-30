import { getMostRecentEvents } from '../../src/group-page/get-most-recent-events';
import { Doi } from '../../src/types/doi';
import { editorialCommunityReviewedArticle } from '../../src/types/domain-events';
import { GroupId } from '../../src/types/group-id';
import { toReviewId } from '../../src/types/review-id';

describe('get-most-recent-events', () => {
  const group1 = new GroupId('1');
  const group2 = new GroupId('2');

  it('only returns events for the given editorial group', async () => {
    const allEvents = [
      editorialCommunityReviewedArticle(group2, new Doi('10.1101/123456'), toReviewId('hypothesis:reviewA')),
      editorialCommunityReviewedArticle(group1, new Doi('10.1101/123456'), toReviewId('hypothesis:reviewB')),
      editorialCommunityReviewedArticle(group2, new Doi('10.1101/123456'), toReviewId('hypothesis:reviewC')),
    ];
    const feed = getMostRecentEvents(group1, 20)(allEvents);

    expect(feed).toHaveLength(1);
    expect(feed[0]).toStrictEqual(allEvents[1]);
  });
});
