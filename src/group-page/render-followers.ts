import { flow } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const renderFragment = (followerCount: number) => `
  <section class="followers">
    <h2>
      Followers
    </h2>
    <p>
      ${followerCount} ${followerCount === 1 ? 'user is' : 'users are'} following this group.
    </p>
  </section>
`;

type RenderFollowers = (followers: number) => HtmlFragment;

export const renderFollowers: RenderFollowers = flow(
  renderFragment,
  toHtmlFragment,
);
