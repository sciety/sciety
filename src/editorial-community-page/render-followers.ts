import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type RenderFollowers = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

type FollowerDetails = {
  avatarUrl: string,
  handle: string,
  displayName: string,
  userId: UserId,
};

type RenderFollower = (followerDetails: FollowerDetails) => Promise<string>;

const renderFollower: RenderFollower = async (followerDetails) => `
  <a href="/users/${followerDetails.userId}" class="follower">
    <img src="${followerDetails.avatarUrl}" alt="" class="follower__avatar">
    <div>
      <div>${followerDetails.displayName}</div>
      <div class="follower__handle">@${followerDetails.handle}</div>
    </div>
  </a>
`;

export type GetFollowers = (editorialCommunityId: EditorialCommunityId) => Promise<Array<FollowerDetails>>;

export default (
  getFollowers: GetFollowers,
): RenderFollowers => (
  async (editorialCommunityId) => {
    let contents = '<p>No followers yet.</p>';
    const followers = await getFollowers(editorialCommunityId);
    if (followers.length > 0) {
      const renderedFollowers = await Promise.all(followers.map(renderFollower));
      contents = `
        <ul class="ui very relaxed list" role="list">
          ${templateListItems(renderedFollowers)}
        </ul>
      `;
    }

    return `
      <section class="ui very padded vertical segment">
        <h2 class="ui header">
          Followers
        </h2>
        ${contents}
      </section>
    `;
  });
