import { renderFollowers } from '../../src/group-page/render-followers';

describe('render-followers', () => {
  it('renders the follower count', async () => {
    const rendered = renderFollowers(2);

    expect(rendered).toStrictEqual(expect.stringContaining('2 users'));
  });
});
