import EditorialCommunityId from '../../src/types/editorial-community-id';
import FollowList from '../../src/types/follow-list';

describe('follow-list', () => {
  const editorialCommunity1Id = new EditorialCommunityId('id1');

  describe('follow', () => {
    describe('when the community to be followed is not currently followed', () => {
      const list = new FollowList([]);

      beforeEach(() => {
        list.follow(editorialCommunity1Id);
      });

      it.todo('follows the community');

      it.todo('leaves all other followed communities in the list');
    });

    describe('when the community to be followed is already followed', () => {
      it.todo('leaves the list unchanged');
    });
  });

  describe('unfollow', () => {
    describe('when the community to be unfollowed is currently followed', () => {
      const list = new FollowList([editorialCommunity1Id]);

      beforeEach(() => {
        list.unfollow(editorialCommunity1Id);
      });

      it.todo('unfollows the community');

      it.todo('leaves all other followed communities in the list');
    });

    describe('when the community to be unfollowed is not already followed', () => {
      it.todo('leaves the list unchanged');
    });
  });
});
