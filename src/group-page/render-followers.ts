import { flow } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderFollowers = (followers: number) => HtmlFragment;

export const renderFollowers: RenderFollowers = flow(
  (followerCount) => `
    <p>
      ${followerCount} ${followerCount === 1 ? 'user is' : 'users are'} following this group.
    </p>
`,
  toHtmlFragment,
);
