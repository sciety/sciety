import EditorialCommunityId from '../types/editorial-community-id';

type RenderFollowers = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export default (): RenderFollowers => (
  async (editorialCommunityId) => {
    let contents = '<p>No followers yet.</p>';
    if (editorialCommunityId.value === 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0') {
      const userDetails = {
        avatarUrl: ' https://pbs.twimg.com/profile_images/622704117635543040/DQRaHUah_normal.jpg',
        handle: 'giorgiosironi',
        displayName: 'Giorgio Sironi 🇮🇹🇬🇧🇪🇺',
        userId: '47998559',
      };
      contents = `
        <ul class="ui list">
          <li class="item">
            <img class="ui avatar image" src="${userDetails.avatarUrl}" alt="">
            <div class="content">
              <a class="header" href="/users/${userDetails.userId}">${userDetails.displayName}</a>
              @${userDetails.handle}
            </div>
          </li>
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
