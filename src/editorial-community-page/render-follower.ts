import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type FollowerDetails = {
  avatarUrl: string,
  handle: string,
  displayName: string,
  userId: UserId,
};

type RenderFollower = (followerDetails: FollowerDetails) => Promise<HtmlFragment>;
type RenderFollowerError = () => Promise<HtmlFragment>;

export const renderFollower: RenderFollower = async (followerDetails) => toHtmlFragment(`
  <a href="/users/${followerDetails.userId}" class="follower">
    <img src="${followerDetails.avatarUrl}" alt="" class="follower__avatar">
    <div>
      <div>${followerDetails.displayName}</div>
      <div class="follower__handle">@${followerDetails.handle}</div>
    </div>
  </a>
`);

export const renderFollowerError: RenderFollowerError = async () => toHtmlFragment(`
  <div class="follower">
    <img src="https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png" alt="" class="follower__avatar">
    <div>Can't retrieve user details</div>
  </div>
`);
