import { JSDOM } from 'jsdom';
import createRenderFollowToggle from '../../src/editorial-community-page/render-follow-toggle';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-follow-toggle', () => {
  describe('when the community is currently followed', () => {
    it('shows an unfollow button', async () => {
      const editorialCommunityId = new EditorialCommunityId('');
      const renderFollowToggle = createRenderFollowToggle();

      const rendered = JSDOM.fragment(await renderFollowToggle(editorialCommunityId));

      const button = rendered.querySelector('button');
      const buttonText = button?.textContent;

      expect(buttonText).toBe('Unfollow');
    });
  });

  describe('when the community is not currently followed', () => {
    it.todo('shows a follow button');
  });
});
