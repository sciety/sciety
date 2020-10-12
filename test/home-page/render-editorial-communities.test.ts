import { URL } from 'url';
import { Maybe } from 'true-myth';
import createRenderEditorialCommunities, { GetAllEditorialCommunities } from '../../src/home-page/render-editorial-communities';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-editorial-communities', (): void => {
  it('lists all of the hard-coded editorial communities', async (): Promise<void> => {
    const dummyGetAllEditorialCommunities: GetAllEditorialCommunities = async () => [
      {
        id: new EditorialCommunityId('A'),
        name: 'Editorial Community A',
        avatar: new URL('http://example.com'),
      },
      {
        id: new EditorialCommunityId('B'),
        name: 'Editorial Community B',
        avatar: new URL('http://example.com'),
      },
    ];
    const renderEditorialCommunities = createRenderEditorialCommunities(
      dummyGetAllEditorialCommunities,
      async () => '',
    );
    const rendered = await renderEditorialCommunities(Maybe.nothing());

    expect(rendered).toContain('Editorial Community A');
    expect(rendered).toContain('Editorial Community B');
  });

  it.todo('displays a follow toggle for each editorial community');
});
