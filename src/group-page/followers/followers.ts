import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { augmentWithUserDetails, Ports as AugmentWithUserDetailsPorts } from './augment-with-user-details';
import { countFollowersOf } from './count-followers-of';
import { findFollowers } from './find-followers';
import { renderFollowers } from './render-followers';
import { DomainEvent } from '../../domain-events';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports = AugmentWithUserDetailsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const followers = (ports: Ports) => (group: Group): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  {
    followerCount: pipe(
      ports.getAllEvents,
      T.map(countFollowersOf(group.id)),
      TE.rightTask,
    ),
    followers: pipe(
      ports.getAllEvents,
      T.map(findFollowers(group.id)),
      TE.rightTask,
      TE.chain(TE.traverseArray(augmentWithUserDetails(ports))),
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.map(renderFollowers),
);
