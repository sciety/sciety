import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderFollowers = (groupId: GroupId) => TE.TaskEither<never, HtmlFragment>;

type GetFollowers = (groupId: GroupId) => T.Task<number>;

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

export const renderFollowers = (getFollowers: GetFollowers): RenderFollowers => flow(
  getFollowers,
  T.map(renderFragment),
  T.map(toHtmlFragment),
  TE.rightTask,
);
