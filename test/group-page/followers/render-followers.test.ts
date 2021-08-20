import * as O from 'fp-ts/Option';
import { renderFollowers } from '../../../src/group-page/followers/render-followers';

describe('render-followers', () => {
  it('renders the follower count', async () => {
    const rendered = renderFollowers({ followerCount: 0, followers: [], nextLink: O.none });

    expect(rendered).toStrictEqual(expect.stringContaining('0 users'));
  });
});
