import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { GroupId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderFollowers = (editorialCommunityId: GroupId) => TE.TaskEither<never, HtmlFragment>;

type GetFollowers<U> = (editorialCommunityId: GroupId) => T.Task<ReadonlyArray<U>>;

const renderFragment = (followerCount: number) => `
  <section class="followers">
    <h2>
      Followers
    </h2>
    <p>
      ${followerCount} ${followerCount === 1 ? 'user is' : 'users are'} following this community.
    </p>
  </section>
`;

export const renderFollowers = <U>(getFollowers: GetFollowers<U>): RenderFollowers => flow(
  getFollowers,
  T.map((followers) => followers.length),
  T.map(renderFragment),
  T.map(toHtmlFragment),
  TE.rightTask,
);
