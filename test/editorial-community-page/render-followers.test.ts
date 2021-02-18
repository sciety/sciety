import * as T from 'fp-ts/Task';
import { renderFollowers } from '../../src/editorial-community-page/render-followers';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';

describe('render-followers', () => {
  it('renders the follower count', async () => {
    const rendered = await renderFollowers(
      () => T.of(['11111111', '22222222']),
    )(new EditorialCommunityId('arbitrary id'))();

    expect(rendered).toContain('2');
  });
});
