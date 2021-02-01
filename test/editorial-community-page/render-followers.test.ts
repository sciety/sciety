import * as T from 'fp-ts/Task';
import { createRenderFollowers } from '../../src/editorial-community-page/render-followers';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';

describe('render-followers', () => {
  it('renders the follower count', async () => {
    const renderFollowers = createRenderFollowers(
      () => T.of(['11111111', '22222222']),
    );

    const rendered = await renderFollowers(new EditorialCommunityId('arbitrary id'))();

    expect(rendered).toContain('2');
  });
});
