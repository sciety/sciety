import createRenderFollowers from '../../src/editorial-community-page/render-followers';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import { toHtmlFragment } from '../../src/types/html-fragment';
import shouldNotBeCalled from '../should-not-be-called';

describe('render-followers', () => {
  describe('when there are followers', () => {
    it('renders the followers, linked to their user page', async () => {
      const renderFollowers = createRenderFollowers(
        async () => ['11111111', '22222222'],
        async (follower) => toHtmlFragment(`/users/${follower}`),
      );

      const rendered = await renderFollowers(new EditorialCommunityId('arbitrary id'));

      expect(rendered).toContain('/users/11111111');
      expect(rendered).toContain('/users/22222222');
    });
  });

  describe('when there are no followers', () => {
    it('renders a message saying there are no followers', async () => {
      const renderFollowers = createRenderFollowers(async () => [], shouldNotBeCalled);

      const rendered = await renderFollowers(new EditorialCommunityId('arbitrary id'));

      expect(rendered).toContain('No followers yet');
    });
  });
});
