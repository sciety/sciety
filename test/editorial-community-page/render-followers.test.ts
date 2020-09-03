import createRenderFollowers from '../../src/editorial-community-page/render-followers';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-followers', () => {
  it('renders a message saying there are no followers', async () => {
    const renderFollowers = createRenderFollowers();

    const rendered = await renderFollowers(new EditorialCommunityId('some-id'));

    expect(rendered).toContain('No followers yet');
  });
});
