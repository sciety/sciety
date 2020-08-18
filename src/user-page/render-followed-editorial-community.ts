import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';

export type RenderFollowedEditorialCommunity = (
  editorialCommunity: EditorialCommunity,
  followList: FollowList,
) => Promise<string>;

type RenderFollowToggle = (followList: FollowList, editorialcommunityid: EditorialCommunityId) => Promise<string>;

interface EditorialCommunity {
  id: EditorialCommunityId;
  name: string;
  avatarUrl: string;
}

export default (
  renderFollowToggle: RenderFollowToggle,
): RenderFollowedEditorialCommunity => (
  async (editorialCommunity, followList) => `
    <div class="label">
      <img src="${editorialCommunity.avatarUrl}" alt="">
    </div>
    <div class="content">
      <div class="summary">
        <a href="/editorial-communities/${editorialCommunity.id.value}">${editorialCommunity.name}</a>
      </div>
    </div>
    <div class="right floated">
      ${await renderFollowToggle(followList, editorialCommunity.id)}
    </div>
  `
);
