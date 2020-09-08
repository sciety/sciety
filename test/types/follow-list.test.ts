import EditorialCommunityId from '../../src/types/editorial-community-id';
import FollowList from '../../src/types/follow-list';
import userId from '../../src/types/user-id';

describe('follow-list', () => {
  const userId1 = userId('u1');
  const editorialCommunity1Id = new EditorialCommunityId('id1');

  describe('follow', () => {
    describe('when the community to be followed is not currently followed', () => {
      it('follows the community', () => {
        const list = new FollowList(userId1);

        const events = list.follow(editorialCommunity1Id);

        expect(events).toHaveLength(1);
        expect(events[0].editorialCommunityId).toBe(editorialCommunity1Id);
      });
    });

    describe('when the community to be followed is already followed', () => {
      it('leaves the list unchanged', () => {
        const list = new FollowList(userId1);

        list.follow(editorialCommunity1Id);
        const events = list.follow(new EditorialCommunityId(editorialCommunity1Id.value));

        expect(events).toHaveLength(0);
      });
    });
  });

  describe('unfollow', () => {
    describe('when the community to be unfollowed is currently followed', () => {
      it('unfollows the community', async () => {
        const list = new FollowList(userId1);
        list.follow(editorialCommunity1Id);

        const events = list.unfollow(editorialCommunity1Id);

        expect(events).toHaveLength(1);
        expect(events[0].editorialCommunityId).toBe(editorialCommunity1Id);
      });
    });

    describe('when the community to be unfollowed is not already followed', () => {
      it.todo('leaves the list unchanged');
    });
  });
});
