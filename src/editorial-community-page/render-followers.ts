import templateListItems from '../shared-components/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderFollowers = (editorialCommunityId: EditorialCommunityId) => Promise<HtmlFragment>;

type FollowerDetails = {
  avatarUrl: string,
  handle: string,
  displayName: string,
  userId: UserId,
};

type RenderFollower = (followerDetails: FollowerDetails) => Promise<HtmlFragment>;

const renderFollower: RenderFollower = async (followerDetails) => toHtmlFragment(`
  <a href="/users/${followerDetails.userId}" class="follower">
    <img src="${followerDetails.avatarUrl}" alt="" class="follower__avatar">
    <div>
      <div>${followerDetails.displayName}</div>
      <div class="follower__handle">@${followerDetails.handle}</div>
    </div>
  </a>
`);

export type GetFollowers = (editorialCommunityId: EditorialCommunityId) => Promise<Array<FollowerDetails>>;

export default (
  getFollowers: GetFollowers,
): RenderFollowers => (
  async (editorialCommunityId) => {
    let contents = toHtmlFragment('<p>No followers yet.</p>');
    const followers = await getFollowers(editorialCommunityId);
    if (followers.length > 0) {
      const renderedFollowers = await Promise.all(followers.map(renderFollower));
      contents = toHtmlFragment(`
        <ul class="ui very relaxed list" role="list">
          ${templateListItems(renderedFollowers)}
        </ul>
      `);
    }

    return toHtmlFragment(`
      <section class="followers">
        <h2>
          Followers
        </h2>
        ${contents}
      </section>
    `);
  });
