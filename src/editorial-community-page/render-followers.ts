import * as T from 'fp-ts/Task';
import { flow } from 'fp-ts/function';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderFollowers = (editorialCommunityId: EditorialCommunityId) => T.Task<HtmlFragment>;

type GetFollowers<U> = (editorialCommunityId: EditorialCommunityId) => T.Task<ReadonlyArray<U>>;

const renderFragment = (followerCount: number): string => `
  <section class="followers">
    <h2>
      Followers
    </h2>
    <p>
      ${followerCount} ${followerCount === 1 ? 'user is' : 'users are'} following this community.
    </p>
  </section>
`;

export const createRenderFollowers = <U>(getFollowers: GetFollowers<U>): RenderFollowers => flow(
  getFollowers,
  T.map((followers) => followers.length),
  T.map(renderFragment),
  T.map(toHtmlFragment),
);
