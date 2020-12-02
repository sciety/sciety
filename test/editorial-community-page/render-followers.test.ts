import { Maybe } from 'true-myth';
import createRenderFollowers, { GetFollowers } from '../../src/editorial-community-page/render-followers';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import toUserId from '../../src/types/user-id';

describe('render-followers', () => {
  describe('when there are followers', () => {
    it('renders the followers, linked to their user page', async () => {
      const getFollowers: GetFollowers = async () => [
        Maybe.just({
          avatarUrl: 'http://example.com',
          handle: 'some_user',
          displayName: 'Some User',
          userId: toUserId('11111111'),
        }),
        Maybe.just({
          avatarUrl: 'http://example.com',
          handle: 'some_other_user',
          displayName: 'Some Other User',
          userId: toUserId('22222222'),
        }),
      ];
      const renderFollowers = createRenderFollowers(getFollowers);

      const rendered = await renderFollowers(new EditorialCommunityId('arbitrary id'));

      expect(rendered).toContain('/users/11111111');
      expect(rendered).toContain('/users/22222222');
    });
  });

  describe('when there are no followers', () => {
    it('renders a message saying there are no followers', async () => {
      const getFollowers: GetFollowers = async () => [];
      const renderFollowers = createRenderFollowers(getFollowers);

      const rendered = await renderFollowers(new EditorialCommunityId('arbitrary id'));

      expect(rendered).toContain('No followers yet');
    });
  });

  describe('when a follower cannot be fetched', () => {
    it('renders an error for that follower', async () => {
      const getFollowers: GetFollowers = async () => [
        Maybe.nothing(),
      ];
      const renderFollowers = createRenderFollowers(getFollowers);

      const rendered = await renderFollowers(new EditorialCommunityId('arbitrary id'));

      expect(rendered).toContain('Can\'t retrieve user details');
    });

    it('renders both the error and the other followers', async () => {
      const getFollowers: GetFollowers = async () => [
        Maybe.nothing(),
        Maybe.just({
          avatarUrl: 'http://example.com',
          handle: 'some_user',
          displayName: 'Some User',
          userId: toUserId('11111111'),
        }),
      ];
      const renderFollowers = createRenderFollowers(getFollowers);

      const rendered = await renderFollowers(new EditorialCommunityId('arbitrary id'));

      expect(rendered).toContain('Can\'t retrieve user details');
      expect(rendered).toContain('/users/11111111');
    });
  });
});
