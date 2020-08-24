import FollowList from '../types/follow-list';
import { UserId } from '../types/user-id';

type RenderPage = (userId: UserId, followList: FollowList) => Promise<string>;

type FollowListBasedComponent = (followList: FollowList) => Promise<string>;
type UserIdBasedComponent = (userId: UserId) => Promise<string>;

export default (
  renderPageHeader: FollowListBasedComponent,
  renderEditorialCommunities: FollowListBasedComponent,
  renderFindArticle: FollowListBasedComponent,
  renderFeed: UserIdBasedComponent,
): RenderPage => async (userId, followList) => `
      <div class="ui aligned stackable grid">
        <div class="row">
          <div class="column">
            ${await renderPageHeader(followList)}
          </div>
        </div>
        <div class="row">
          <section class="ten wide column">
            ${await renderFeed(userId)}
          </section>
          <section class="four wide right floated column">
            ${await renderFindArticle(followList)}
            ${await renderEditorialCommunities(followList)}
          </section>
        </div>
      </div>
    `;
