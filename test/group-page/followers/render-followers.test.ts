import { renderFollowers } from '../../../src/group-page/followers/render-followers';

describe('render-followers', () => {
  it('renders the follower count', async () => {
    const rendered = renderFollowers({ followerCount: 0, followers: [] });

    expect(rendered).toStrictEqual(expect.stringContaining('0 users'));
  });
});
