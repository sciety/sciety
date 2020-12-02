import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type FollowerDetails = {
  avatarUrl: string,
  handle: string,
  displayName: string,
  userId: UserId,
};

type RenderFollower = (followerDetails: FollowerDetails) => Promise<HtmlFragment>;

export const renderFollower: RenderFollower = async (followerDetails) => toHtmlFragment(`
  <a href="/users/${followerDetails.userId}" class="follower">
    <img src="${followerDetails.avatarUrl}" alt="" class="follower__avatar">
    <div>
      <div>${followerDetails.displayName}</div>
      <div class="follower__handle">@${followerDetails.handle}</div>
    </div>
  </a>
`);
