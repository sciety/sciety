import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';

type RenderPage = (handle: string, followList: FollowList) => Promise<string>;

type RenderFollowToggle = (followList: FollowList, editorialcommunityid: EditorialCommunityId) => Promise<string>;

export default (
  renderFollowToggle: RenderFollowToggle,
): RenderPage => (
  async (handle, followList) => `
    <div class="ui aligned stackable grid">
      <div class="row">
        <div class="column">
          <header class="ui basic padded vertical segment">
            <h1>@${handle}</h1>
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
              <li class="event">
                <div class="label">
                  <img src="https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg" alt="">
                </div>
                <div class="content">
                  <div class="summary">
                    <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">Review Commons</a>
                  </div>
                </div>
                <div class="right floated">
                  ${await renderFollowToggle(followList, new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'))}
                </div>
              </li>
              <li class="event">
                <div class="label">
                  <img src="https://pbs.twimg.com/profile_images/1095287970939265026/xgyGFDJk_200x200.jpg" alt="">
                </div>
                <div class="content">
                  <div class="summary">
                    <a href="/editorial-communities/53ed5364-a016-11ea-bb37-0242ac130002">PeerJ</a>
                  </div>
                </div>
                <div class="right floated">
                  ${await renderFollowToggle(followList, new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'))}
                </div>
              </li>
              <li class="event">
                <div class="label">
                  <img src="https://pbs.twimg.com/profile_images/1278236903549145089/qqgLuJu__400x400.jpg" alt="">
                </div>
                <div class="content">
                  <div class="summary">
                    <a href="/editorial-communities/74fd66e9-3b90-4b5a-a4ab-5be83db4c5de">Peer Community In Zoology</a>
                  </div>
                </div>
                <div class="right floated">
                  ${await renderFollowToggle(followList, new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'))}
                </div>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  `
);
