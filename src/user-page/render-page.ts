import { RenderFollowedEditorialCommunity } from './render-followed-editorial-community';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';
import { UserId } from '../types/user-id';

type RenderPage = (userId: UserId, followList: FollowList) => Promise<string>;

const hardCodedFollowList = [
  {
    id: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
    name: 'Review Commons',
    avatarUrl: 'https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg',
  },
  {
    id: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    name: 'PeerJ',
    avatarUrl: 'https://pbs.twimg.com/profile_images/1095287970939265026/xgyGFDJk_200x200.jpg',
  },
  {
    id: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    name: 'Peer Community In Zoology',
    avatarUrl: 'https://pbs.twimg.com/profile_images/1278236903549145089/qqgLuJu__400x400.jpg',
  },
];

export default (
  renderFollowedEditorialCommunity: RenderFollowedEditorialCommunity,
): RenderPage => (
  async (userId, followList) => {
    const list = await Promise.all(hardCodedFollowList
      .map(async (editorialCommunity) => renderFollowedEditorialCommunity(editorialCommunity, followList)));
    return `
      <div class="ui aligned stackable grid">
        <div class="row">
          <div class="column">
            <header class="ui basic padded vertical segment">
              <h1>@${userId}</h1>
            </header>
          </div>
        </div>
        <div class="row">
          <div class="ten wide column">
            <section>
              <h2 class="ui header">
                Following
              </h2>
              <ol class="ui large feed">
                ${templateListItems(list, 'event')}
              </ol>
            </section>
          </div>
        </div>
      </div>
    `;
  }
);
