import { Maybe } from 'true-myth';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type RenderFollowedEditorialCommunity = (
  editorialCommunity: EditorialCommunity,
  userId: Maybe<UserId>,
) => Promise<string>;

type RenderFollowToggle = (userId: Maybe<UserId>, editorialcommunityid: EditorialCommunityId) => Promise<string>;

interface EditorialCommunity {
  id: EditorialCommunityId;
  name: string;
  avatarUrl: string;
}

export default (
  renderFollowToggle: RenderFollowToggle,
): RenderFollowedEditorialCommunity => (
  async (editorialCommunity, userId) => `
    <div class="label">
      <img src="${editorialCommunity.avatarUrl}" alt="">
    </div>
    <div class="content">
      <div class="summary">
        <a href="/editorial-communities/${editorialCommunity.id.value}">${editorialCommunity.name}</a>
      </div>
    </div>
    <div class="right floated">
      ${await renderFollowToggle(userId, editorialCommunity.id)}
    </div>
  `
);
