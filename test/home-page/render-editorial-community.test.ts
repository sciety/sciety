import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import createRenderEditorialCommunity from '../../src/home-page/render-editorial-community';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import { toHtmlFragment } from '../../src/types/html-fragment';

describe('render-editorial-community', (): void => {
  it('renders the name of the community', async (): Promise<void> => {
    const community = {
      id: new EditorialCommunityId('A'),
      name: 'Editorial Community A',
      avatar: new URL('http://example.com'),
    };
    const renderEditorialCommunity = createRenderEditorialCommunity(
      async () => toHtmlFragment(''),
    );
    const rendered = await renderEditorialCommunity(O.none)(community)();

    expect(rendered).toContain('Editorial Community A');
  });

  it.todo('displays a follow toggle');
});
