import EditorialCommunityId from '../../src/types/editorial-community-id';
import FollowList from '../../src/types/follow-list';

describe('follow-list', () => {
  describe ('follow', () => {
    describe('when the community to be followed is not currently followed', () => {
      it('follows the community', () => {
        const editorialCommunity1Id = new EditorialCommunityId('id1');
        const list = new FollowList([]);
        list.follow(editorialCommunity1Id);

        expect(list.follows(editorialCommunity1Id)).toBe(true);
      });

      it.todo('leaves all other followed communities in the list');
    });

    describe('when the community to be followed is already followed', () => {
      it.todo('leaves the list unchanged');
    });
  });

  describe('follows', () => {
    it.todo('returns true for a followed editorial community');

    it.todo('returns false for a non-followed editorial community');
  });

  describe('unfollow', () => {
    describe('when the community to be unfollowed is currently followed', () => {
      it('unfollows the community', () => {
        const editorialCommunity1Id = new EditorialCommunityId('id1');
        const list = new FollowList([editorialCommunity1Id]);
        list.unfollow(editorialCommunity1Id);

        expect(list.follows(editorialCommunity1Id)).toBe(false);
      });

      it.todo('leaves all other followed communities in the list');
    });

    describe('when the community to be unfollowed is not already followed', () => {
      it.todo('leaves the list unchanged');
    });
  });
});
