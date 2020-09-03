import createRenderFollowers from '../../src/editorial-community-page/render-followers';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-followers', () => {
  describe('for eLife', () => {
    it('hardcode a single follower linked to their user page', async () => {
      const renderFollowers = createRenderFollowers();

      const rendered = await renderFollowers(new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'));

      expect(rendered).toContain('/users/47998559');
    });
  });

  describe('for other communities', () => {
    it('renders a message saying there are no followers', async () => {
      const renderFollowers = createRenderFollowers();

      const rendered = await renderFollowers(new EditorialCommunityId('some-id'));

      expect(rendered).toContain('No followers yet');
    });
  });
});
