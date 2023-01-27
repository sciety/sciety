import { renderFollowers } from '../../../../src/html-pages/group-page/render-as-html/render-followers';
import { toHtmlFragment } from '../../../../src/types/html-fragment';

describe('render-followers', () => {
  it('renders the follower count', async () => {
    const rendered = renderFollowers({ followerCount: 0, followers: [], nextLink: toHtmlFragment('') });

    expect(rendered).toStrictEqual(expect.stringContaining('0 users'));
  });
});
