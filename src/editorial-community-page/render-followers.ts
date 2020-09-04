import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import toUserId, { UserId } from '../types/user-id';

type RenderFollowers = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

type UserDetails = {
  avatarUrl: string,
  handle: string,
  displayName: string,
  userId: UserId,
};

type RenderFollower = (userDetails: UserDetails) => Promise<string>;

const renderFollower: RenderFollower = async (userDetails) => `
  <img class="ui avatar image" src="${userDetails.avatarUrl}" alt="">
  <div class="content">
    <a class="header" href="/users/${userDetails.userId}">${userDetails.displayName}</a>
    @${userDetails.handle}
  </div>
`;

export default (): RenderFollowers => (
  async (editorialCommunityId) => {
    let contents = '<p>No followers yet.</p>';
    if (editorialCommunityId.value === 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0') {
      const followerDetails = [{
        avatarUrl: ' https://pbs.twimg.com/profile_images/622704117635543040/DQRaHUah_normal.jpg',
        handle: 'giorgiosironi',
        displayName: 'Giorgio Sironi 🇮🇹🇬🇧🇪🇺',
        userId: toUserId('47998559'),
      }];

      const followers = await Promise.all(followerDetails.map(renderFollower));

      contents = `
        <ul class="ui list">
          ${templateListItems(followers)}
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
