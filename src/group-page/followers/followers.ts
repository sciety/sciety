import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { countFollowersOf } from './count-followers-of';
import { renderFollowers } from './render-followers';
import { DomainEvent } from '../../domain-events';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';
import { toUserId } from '../../types/user-id';

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const userCardViewModel = {
  link: '/users/scietyhq',
  title: 'Sciety',
  handle: 'scietyHQ',
  avatarUrl: 'https://pbs.twimg.com/profile_images/1323645945179967488/DIp-lv6v_normal.png',
  listCount: 1,
  followedGroupCount: 13,
};

export const followers = (ports: Ports) => (group: Group): TE.TaskEither<never, HtmlFragment> => pipe(
  {
    followerCount: pipe(
      ports.getAllEvents,
      T.map(countFollowersOf(group.id)),
    ),
    followers: pipe(
      process.env.EXPERIMENT_ENABLED === 'true' ? [{
        userId: toUserId('1295307136415735808'),
        listCount: 1,
        followedGroupCount: 13,
      }] : [],
      RA.map(() => userCardViewModel),
      T.of,
    ),
  },
  sequenceS(T.ApplyPar),
  T.map(flow(
    renderFollowers,
    E.right,
  )),
);
