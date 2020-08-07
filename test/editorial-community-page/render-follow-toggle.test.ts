import { JSDOM } from 'jsdom';
import createRenderFollowToggle, { IsFollowed } from '../../src/editorial-community-page/render-follow-toggle';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-follow-toggle', () => {
  describe('when the community is currently followed', () => {
    it('shows an unfollow button', async () => {
      const editorialCommunityId = new EditorialCommunityId('');
      const isFollowed: IsFollowed = async () => true;
      const renderFollowToggle = createRenderFollowToggle(isFollowed);

      const rendered = JSDOM.fragment(await renderFollowToggle(editorialCommunityId));

      const button = rendered.querySelector('button');
      const buttonText = button?.textContent;

      expect(buttonText).toBe('Unfollow');
    });
  });

  describe('when the community is not currently followed', () => {
    it('shows a follow button', async () => {
      const editorialCommunityId = new EditorialCommunityId('');
      const isFollowed: IsFollowed = async () => false;
      const renderFollowToggle = createRenderFollowToggle(isFollowed);

      const rendered = JSDOM.fragment(await renderFollowToggle(editorialCommunityId));

      const button = rendered.querySelector('button');
      const buttonText = button?.textContent;

      expect(buttonText).toBe('Follow');
    });
  });
});
