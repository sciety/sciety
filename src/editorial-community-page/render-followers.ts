import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import EditorialCommunityId from '../types/editorial-community-id';
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

export default <U>(
  getFollowers: GetFollowers<U>,
): RenderFollowers => (
  (editorialCommunityId) => (
    pipe(
      editorialCommunityId,
      getFollowers,
      T.map((followers) => followers.length),
      T.map(renderFragment),
      T.map(toHtmlFragment),
    )
  )
);
