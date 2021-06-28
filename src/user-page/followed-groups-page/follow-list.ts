import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { followedGroupIds, GetAllEvents } from './project-followed-group-ids';
import { renderFollowList } from './render-follow-list';
import { populateGroupViewModel, Ports as PopulateGroupViewModelPorts } from '../../shared-components/group-card/populate-group-view-model';
import { renderGroupCard } from '../../shared-components/group-card/render-group-card';
import { HtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';
import { followingNothing, informationUnavailable } from '../static-messages';

type FollowedGroupIdsPorts = {
  getAllEvents: GetAllEvents,
};

export type Ports = PopulateGroupViewModelPorts & FollowedGroupIdsPorts;

type FollowList = (ports: Ports) => (userId: UserId, viewingUserId: O.Option<UserId>)
=> TE.TaskEither<never, HtmlFragment>;

export const followList: FollowList = (ports) => (userId) => pipe(
  userId,
  TE.right,
  TE.chain(flow(
    followedGroupIds(ports.getAllEvents),
    TE.mapLeft(() => followingNothing),
  )),
  TE.chain(flow(
    TE.traverseArray(populateGroupViewModel(ports)),
    TE.mapLeft(() => informationUnavailable),
  )),
  TE.map(flow(
    RA.map(renderGroupCard),
    renderFollowList,
  )),
  TE.toUnion,
  TE.rightTask,
);
