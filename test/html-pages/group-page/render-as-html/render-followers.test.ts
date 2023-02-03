import { renderFollowers } from '../../../../src/html-pages/group-page/render-as-html/render-followers';
import { FollowersTab } from '../../../../src/html-pages/group-page/view-model';
import { toHtmlFragment } from '../../../../src/types/html-fragment';

describe('render-followers', () => {
  it('renders the follower count', async () => {
    const tab: FollowersTab = {
      selector: 'followers' as const,
      followerCount: 0,
      followers: [],
      nextLink: toHtmlFragment(''),
    };
    const rendered = renderFollowers(tab);

    expect(rendered).toStrictEqual(expect.stringContaining('0 users'));
  });
});
