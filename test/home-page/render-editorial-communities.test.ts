import createRenderEditorialCommunities from '../../src/home-page/render-editorial-communities';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import userId from '../../src/types/user-id';

describe('render-editorial-communities', (): void => {
  it('lists all of the hard-coded editorial communities', async (): Promise<void> => {
    const dummyCommunities = [
      {
        id: new EditorialCommunityId('A'),
        name: 'Editorial Community A',
      },
      {
        id: new EditorialCommunityId('B'),
        name: 'Editorial Community B',
      },
    ];
    const renderEditorialCommunities = createRenderEditorialCommunities(
      async () => dummyCommunities,
      async () => '',
    );
    const rendered = await renderEditorialCommunities(userId('u1'));

    expect(rendered).toContain('Editorial Community A');
    expect(rendered).toContain('Editorial Community B');
  });

  it.todo('displays a follow toggle for each editorial community');
});
