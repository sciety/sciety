import EditorialCommunityId from '../../src/types/editorial-community-id';
import FollowList from '../../src/types/follow-list';
import userId from '../../src/types/user-id';

describe('follow-list', () => {
  const userId1 = userId('u1');
  const editorialCommunity1Id = new EditorialCommunityId('id1');

  describe('follow', () => {
    describe('when the community to be followed is not currently followed', () => {
      it('follows the community', () => {
        const list = new FollowList(userId1, []);

        const event = list.follow(editorialCommunity1Id);

        expect(event.editorialCommunityId).toBe(editorialCommunity1Id);
      });
    });

    describe('when the community to be followed is already followed', () => {
      it.todo('leaves the list unchanged');
    });
  });

  describe('unfollow', () => {
    describe('when the community to be unfollowed is currently followed', () => {
      it('unfollows the community', async () => {
        const list = new FollowList(userId1, [editorialCommunity1Id]);

        const event = list.unfollow(editorialCommunity1Id);

        expect(event.editorialCommunityId).toBe(editorialCommunity1Id);
      });
    });

    describe('when the community to be unfollowed is not already followed', () => {
      it.todo('leaves the list unchanged');
    });
  });
});
