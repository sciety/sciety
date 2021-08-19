import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { countFollowersOf } from './count-followers-of';
import { renderFollowers } from './render-followers';
import { DomainEvent } from '../../domain-events';
import { Group } from '../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const userCardViewModel = {
  link: '/users/scietyhq',
  title: 'Sciety',
  handle: 'scietyHQ',
  listCount: 1,
  followedGroupCount: 13,
  avatarUrl: 'https://pbs.twimg.com/profile_images/1323645945179967488/DIp-lv6v_normal.png',
};

export const followers = (ports: Ports) => (group: Group): TE.TaskEither<never, HtmlFragment> => pipe(
  ports.getAllEvents,
  T.map(flow(
    countFollowersOf(group.id),
    (followerCount) => ({
      followerCount,
      followers: process.env.EXPERIMENT_ENABLED === 'true' ? [userCardViewModel] : [],
    }),
    renderFollowers,
    toHtmlFragment,
    E.right,
  )),
);
