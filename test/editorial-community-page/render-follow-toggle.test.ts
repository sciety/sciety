import { JSDOM } from 'jsdom';
import createRenderFollowToggle, { GetFollowList } from '../../src/editorial-community-page/render-follow-toggle';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import FollowList from '../../src/types/follow-list';
import toUserId from '../../src/types/user-id';

describe('render-follow-toggle', () => {
  describe('when the community is currently followed', () => {
    it('shows an unfollow button', async () => {
      const userId = toUserId('u1');
      const editorialCommunityId = new EditorialCommunityId('');

      const getFollowList: GetFollowList = async () => new FollowList([editorialCommunityId]);
      const renderFollowToggle = createRenderFollowToggle(getFollowList);

      const rendered = JSDOM.fragment(
        await renderFollowToggle(userId, editorialCommunityId),
      );

      const button = rendered.querySelector('button');
      const buttonText = button?.textContent;

      expect(buttonText).toBe('Unfollow');
    });
  });

  describe('when the community is not currently followed', () => {
    it('shows a follow button', async () => {
      const userId = toUserId('u1');
      const editorialCommunityId = new EditorialCommunityId('');

      const getFollowList: GetFollowList = async () => new FollowList([]);
      const renderFollowToggle = createRenderFollowToggle(getFollowList);

      const rendered = JSDOM.fragment(await renderFollowToggle(userId, editorialCommunityId));

      const button = rendered.querySelector('button');
      const buttonText = button?.textContent;

      expect(buttonText).toBe('Follow');
    });
  });
});
